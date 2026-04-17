import { NextResponse } from 'next/server';
import { getCurrencySymbol } from '@/lib/currency';
import { triggerBackgroundNotification } from '@/workers/notificationWorker';
import { parseLocalizedNumber, calculateFinalPricing } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // The endpoint config
    // Ensure you have these defined in .env
    // MENTOR_API_URL could also be reused if it's the base URL, but we will construct the URL for Form ID 673
    const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';
    const formId = 673;

    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_PASSWORD;

    if (!wpUser || !wpPassword) {
      console.error('Missing WordPress credentials in .env');
      return NextResponse.json(
        { error: 'Server configuration error: Missing WP credentials' },
        { status: 500 }
      );
    }

    // Map your frontend field names to Formidable field IDs.
    // Replace the strings like 'field_name_id' with the actual numeric field IDs from WordPress 
    const itemMeta: Record<string, string | number | string[]> = {};
    
    // We conditionally add fields that exist in the payload to the item_meta object.
    // Using an ID map where keys match the keys in the body payload from WorkshopEnrollmentDialog.
    const fieldMapping: Record<string, string> = {
      pid: '9788',
      workshopTitle: '9789',
      name: '9792',
      email: '9793',
      mobileNumber: '9794',
      currentAffiliation: '9795',
      profession: '9796',
      designation: '9797',
      address: '9800',
      state: '9801',
      country: '9802',
      pinCode: '9805',
      gstVatNo: '9806',
      courseFee: '9809',
      hasCoupon: '9811',
      couponCode: '9815',
      payableAmount: '9810',
      otherCurrency: '9812',
      referralSource: '9814',
      payment_status: '9817', 
      razorpay_order_id: '9816', 
      learningMode: '9824', // Reusing profession field for learning mode in courses
      category: '9823', // NEW FIELD for Workshop vs Course
    };

    // Populate item_meta dynamically based on mapping
    for (const [bodyKey, fieldId] of Object.entries(fieldMapping)) {
      if (body[bodyKey] !== undefined) {
        let value = body[bodyKey];

        // Formidable radio/dropdowns usually expect proper case
        if (bodyKey === 'hasCoupon' || bodyKey === 'otherCurrency') {
          value = value === 'yes' ? 'Yes' : 'No';
        }

        // Special case for referralSource 'Other' -> 'other'
        if (bodyKey === 'referralSource' && value === 'Other') {
          value = 'other';
        }

        // Special case for phone number concatenation
        if (bodyKey === 'mobileNumber' && body.countryCode) {
          value = `${body.countryCode}${value}`.replace(/\s/g, ''); // Remove spaces
        }

        // NO LONGER STRIPPING CURRENCY SYMBOLS (Preserve ₹ and $ for WordPress)
        /*
        if (bodyKey === 'courseFee' || bodyKey === 'payableAmount') {
          if (value && typeof value === 'string') {
             // Keep only digits and decimal points
             const sanitized = value.replace(/[^0-9.]/g, '');

             value = sanitized;
          }
        }
        */

        itemMeta[fieldId] = value;
      }
    }

    // Construct the payload for Formidable API
    const payload = {
      form_id: formId,
      item_meta: itemMeta
    };

    // Dynamic endpoint target: PUT if entryId exists (update), else POST (create)
    const isUpdate = !!body.entryId;
    const fetchUrl = isUpdate ? `${FORMIDABLE_API_URL}/${body.entryId}` : FORMIDABLE_API_URL;
    const fetchMethod = isUpdate ? 'PUT' : 'POST';

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    const response = await fetch(fetchUrl, {
      method: fetchMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    // Robust JSON parsing
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const errorText = await response.text();
      console.error('Formidable API returned non-JSON response:', response.status, errorText);
      return NextResponse.json(
        { error: 'Backend connectivity issue (Non-JSON response).' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error('Formidable API Error Details:', result);
      return NextResponse.json(
        { error: result.message || 'Failed to submit form to backend.' },
        { status: response.status }
      );
    }

    const newEntryId = isUpdate ? body.entryId : (result.id || body.entryId);

    const cleanCourseFee = body.courseFee?.toString() || '0';
    const cleanPayableAmount = body.payableAmount?.toString() || '0';
    const currencyCode = body.currency || 'USD';
    const currencySymbol = body.currencySymbol || (cleanPayableAmount.includes('₹') ? '₹' : '$');

    // Determine initial status based on payment requirement
    const calculatedPayable = parseLocalizedNumber(cleanPayableAmount);
    const calculatedCourse = parseLocalizedNumber(cleanCourseFee);
    const amountVal = calculatedPayable > 0 ? calculatedPayable : calculatedCourse;
    const isFree = isNaN(amountVal) || amountVal <= 0;
    const paymentStatus = isFree ? 'SUCCESS' : (body.payment_status || 'PENDING');

    // DEFINE THE PRICING BREAKDOWN (Single Source of Truth)
    const pricingBreakdown = calculateFinalPricing({
        country: body.country || 'India',
        state: body.state,
        basePrice: amountVal,
        currency: currencyCode,
        isInclusive: false // Business Rule: Sticker Price is BASE
    });

    const restrictedMeta = {
      '9817': paymentStatus,
      '9816': body.razorpay_order_id || '',
      '9819': body.razorpay_payment_id || '',
      '9821': body.razorpay_signature || '',
      '9809': `${pricingBreakdown.currencySymbol}${pricingBreakdown.basePrice}`,
      '9810': `${pricingBreakdown.currencySymbol}${pricingBreakdown.finalTotal}`,
      '9800': body.address || '',
      '9801': body.state || '',
      '9802': body.country || '',
      '9805': body.pinCode || '',
      '9812': body.otherCurrency === 'yes' ? 'Yes' : 'No', // Currency override
      '9825': pricingBreakdown.basePrice,
      '9826': pricingBreakdown.taxAmount,
      '9827': pricingBreakdown.surchargeAmount,
      '9828': pricingBreakdown.cgstAmount || 0,
      '9829': pricingBreakdown.sgstAmount || 0,
      '9830': pricingBreakdown.igstAmount || 0,
      '9832': JSON.stringify(pricingBreakdown) // Full Breakdown JSON for deterministic UI
    };

    // STEP 2: Wait 1s and PATCH the restricted Read-Only payment fields manually
    await new Promise(resolve => setTimeout(resolve, 1000));


    try {
      await fetch(`${FORMIDABLE_API_URL}/${newEntryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({ item_meta: restrictedMeta }),
      });
    } catch (patchErr) {
      console.error('Failed to PATCH restricted initial payment defaults:', patchErr);
    }

    const mergedItemMeta = {
      ...itemMeta,
      ...restrictedMeta
    };

    // ALWAYS trigger the initial webhook to IMS
    try {
      const webhookPayload = {
        companyId: "3a148605-aa1c-42b4-8ab8-f78c039ee9c0",
        brandId: "fbb632ae",
        ...body, // Capture all named frontend keys (name, email, profession, etc.)
        ...mergedItemMeta, // Capture all Formidable numeric IDs
        pricingBreakdown: pricingBreakdown, // PASS FULL BREAKDOWN
        courseFee: `${pricingBreakdown.currencySymbol}${pricingBreakdown.basePrice}`,
        payableAmount: `${pricingBreakdown.currencySymbol}${pricingBreakdown.finalTotal}`,
        payableFeeAmount: `${pricingBreakdown.currencySymbol}${pricingBreakdown.finalTotal}`, 
        currency: pricingBreakdown.currency,
        currencySymbol: pricingBreakdown.currencySymbol,
        taxAmount: pricingBreakdown.taxAmount,
        extraChargeAmount: pricingBreakdown.surchargeAmount,
        basePrice: pricingBreakdown.basePrice,
        '9825': pricingBreakdown.basePrice,
        '9817': (paymentStatus || '').toLowerCase(),
        '9816': body.razorpay_order_id || '',
        '9819': body.razorpay_payment_id || '',
        '9800': body.address || '',
        '9801': body.state || '',
        '9802': body.country || '',
        '9805': body.pinCode || ''
      };
      
      const whRes = await fetch('https://ims.panoptical.org/api/webhooks/nanoschool-registration', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LEAD_WEBHOOK_SECRET}`
        },
        body: JSON.stringify(webhookPayload),
      });
      
      if (!whRes.ok) {
        const whErrText = await whRes.text();
        console.error('Initial IMS Webhook rejected payload:', whRes.status, whErrText);
      } else {

      }
    } catch (whError) {
      console.error('Initial webhook failed:', whError);
    }

    const returnMeta = {
      ...mergedItemMeta,
      ...body
    };

    // TRIGGER POST-ENROLLMENT NOTIFICATIONS (ASYNC)
    const notificationPhone = body.mobileNumber 
      ? (`${body.countryCode || ''}${body.mobileNumber}`).replace(/\s/g, '') 
      : '';

    if (body.email) {
      triggerBackgroundNotification({
        email: body.email,
        name: body.name || 'Student',
        phone: notificationPhone,
        courseName: body.workshopTitle || body.course || 'NanoSchool Program',
        enrollmentId: newEntryId ? String(newEntryId) : undefined
      }).catch(err => {
        // We catch here so that a failure in the notification engine doesn't break the user's checkout experience
        console.error('Failed to dispatch background notifications:', err);
      });
    }

    return NextResponse.json({ success: true, data: result, itemMeta: returnMeta }, { status: 200 });
  } catch (error: any) {
    console.error('Error in Formidable API Route:', error);
    // Provide slightly more context for debugging 500s during this phase
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred processing your request.',
        details: error.message || 'Unknown server error'
      },
      { status: 500 }
    );
  }
}
