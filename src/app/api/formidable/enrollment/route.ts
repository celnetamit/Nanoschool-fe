import { NextResponse } from 'next/server';

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

        itemMeta[fieldId] = value;
      }
    }

    // Construct the payload for Formidable API
    const payload = {
      form_id: formId,
      item_meta: itemMeta
    };

    // Execute the POST request
    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    const response = await fetch(FORMIDABLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Formidable API Error:', result);
      return NextResponse.json(
        { error: result.message || 'Failed to submit form to backend.' },
        { status: response.status }
      );
    }

    const newEntryId = result.id;

    // STEP 2: Wait 1s and PATCH the restricted Read-Only payment fields manually
    // Since Formidable API ignores Default Values and drops Read-Only fields on POST,
    // we must dynamically PATCH the "not_completed" defaults immediately after lead creation.
    await new Promise(resolve => setTimeout(resolve, 1000));
    const restrictedMeta = {
      '9817': body.payment_status || 'payment not completed',
      '9816': body.razorpay_order_id || 'NA',
      '9819': body.razorpay_payment_id || 'NA',
      '9821': body.razorpay_signature || 'NA',
      '9809': body.courseFee || '',
      '9810': body.payableAmount || ''
    };

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

    // If course is free (amount <= 0), we bypass Razorpay and trigger the webhook now
    const amountVal = parseFloat(body.payableAmount?.toString().replace(/[^0-9.]/g, '') || String(body.courseFee || '').replace(/[^0-9.]/g, '') || '0');
    if (isNaN(amountVal) || amountVal <= 0) {
      try {
        const webhookPayload = {
          ...itemMeta,
          '9817': 'SUCCESS' // Or 'FREE' depending on your requirements
        };
        await fetch('https://ims.panoptical.org/api/webhooks/nanoschool-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
      } catch (whError) {
        console.error('Initial webhook failed:', whError);
      }
    }

    return NextResponse.json({ success: true, data: result, itemMeta: itemMeta }, { status: 200 });
  } catch (error) {
    console.error('Error in Formidable API Route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred processing your request.' },
      { status: 500 }
    );
  }
}
