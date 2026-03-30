import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Define the interface for the incoming data
interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

interface PaymentRequestPayload {
  payment_status: 'completed' | 'not_completed';
  user: UserDetails;
  
  // Required if completed
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount?: number;
  currency?: string;
  payment_method?: string;
  
  // Optional for not_completed
  reason?: string;
  timestamp?: string;
  
  // Also allowing arbitrary data for flexibility
  [key: string]: any;
}

// Function to post data to WordPress Formidable API
async function saveToWordPress(data: any) {
  try {
    const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';
    const formId = 673; // Matching the workshop/course enrollment form

    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_PASSWORD;

    if (!wpUser || !wpPassword) {
      throw new Error('Missing WordPress credentials in .env');
    }

    // Comprehensive mapping of frontend keys to Formidable field IDs
    const fieldMapping: Record<string, string> = {
      pid: '9788',
      workshopTitle: '9789',
      name: '9792',
      email: '9793',
      mobileNumber: '9794',
      phone: '9794', // Alias for mobileNumber since user object has 'phone'
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
      amount: '9810', // Alias for payableAmount
      otherCurrency: '9812',
      currency: '9812', // Alias for otherCurrency
      referralSource: '9814',
      reason: '9814', // Fallback for referralSource if reason is provided
      learningMode: '9824',
      category: '9823',
    };

    const itemMeta: Record<string, string> = {};

    // Map the standard user fields and extra root-level fields dynamically
    const allData = { ...data, ...(data.user || {}) };
    
    // Core payload without restricted fields
    // We omit 9816, 9817, 9819, 9821 from the initial POST because Formidable drops 
    // fields with conditional logic or Admin Only visibility during POST creation.
    const restrictedFields = ['9816', '9817', '9819', '9821'];
    
    for (const [key, fieldId] of Object.entries(fieldMapping)) {
      if (allData[key] !== undefined && !restrictedFields.includes(fieldId)) {
        let value = allData[key];
        if (key === 'hasCoupon' || key === 'otherCurrency') {
          value = value === 'yes' ? 'Yes' : 'No';
        }
        itemMeta[fieldId] = String(value);
      }
    }

    const payload = {
      form_id: formId,
      item_meta: itemMeta
    };

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    
    // STEP 1: Create the entry by POSTing valid standard fields
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
      console.error('Formidable API Error on POST:', result);
      throw new Error(result.message || 'Failed to submit data to WordPress Formidable.');
    }

    const newEntryId = result.id;

    // STEP 2: Wait 1 second before PATCHing to prevent WordPress database lock race conditions
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Formidable allows overriding restricted fields via PATCH, similar to verify-payment logic.
    const restrictedMeta: Record<string, string> = {
      '9817': data.payment_status === 'completed' ? 'payment_success' : 'payment not completed',
      '9816': data.razorpay_order_id || 'NA',
      '9819': data.razorpay_payment_id || 'NA',
      '9821': data.razorpay_signature || 'NA',
      '9809': data.courseFee ? String(data.courseFee) : '',
      '9810': data.payableAmount || data.amount ? String(data.payableAmount || data.amount) : ''
    };

    const patchResponse = await fetch(`${FORMIDABLE_API_URL}/${newEntryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ item_meta: restrictedMeta }),
    });

    const patchResult = await patchResponse.json();

    if (!patchResponse.ok) {
      console.error('Formidable API Error on PATCH restricted fields:', patchResult);
      // We still return success but note the failure in logs since entry was created.
      console.error('Entry was created but restricted fields failed to attach.');
    }

    return { ...data, wp_entry_id: newEntryId };
  } catch (error) {
    console.error('Error saving to WordPress:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequestPayload = await request.json();

    // 1. Basic validation required for both scenarios
    if (!body.payment_status || !['completed', 'not_completed'].includes(body.payment_status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing payment_status. Must be "completed" or "not_completed"' },
        { status: 400 }
      );
    }

    if (!body.user || !body.user.name || !body.user.email || !body.user.phone) {
      return NextResponse.json(
        { success: false, error: 'User details (name, email, phone) are required.' },
        { status: 400 }
      );
    }

    // Prepare common data structure
    const commonData = {
      user: body.user,
      payment_status: body.payment_status,
      timestamp: body.timestamp || new Date().toISOString(),
      razorpay_order_id: body.razorpay_order_id,
    };

    // 2. Scenario-specific handling
    if (body.payment_status === 'completed') {
      // ----------------------------------------------------
      // Scenario 1: Complete Payment
      // ----------------------------------------------------
      
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, payment_method } = body;

      // Validate required completed payment fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || !currency) {
        return NextResponse.json(
          { success: false, error: 'Missing required Razorpay payment details for completed status.' },
          { status: 400 }
        );
      }

      const secret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!secret) {
        console.error('RAZORPAY_KEY_SECRET is not configured in environment variables');
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        );
      }

      // Verify the cryptographic signature from Razorpay
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment signature. Payment might be forged.' },
          { status: 400 }
        );
      }

      // Construct final record for completed payment
      const paymentRecord = {
        ...commonData,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        currency,
        payment_method,
        // include any extra payload fields if needed
        ...body
      };

      // Save to WordPress Formidable API
      const savedRecord = await saveToWordPress(paymentRecord);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Payment verified and stored to WordPress successfully.',
          data: savedRecord 
        },
        { status: 200 }
      );

    } else {
      // ----------------------------------------------------
      // Scenario 2: Registration Only (Not Completed)
      // ----------------------------------------------------
      
      const { reason } = body;

      // Construct final record for incomplete payment
      const registrationRecord = {
        ...commonData,
        reason: reason || 'User abandoned payment or failed',
        // include any extra payload fields if needed
        ...body
      };

      // Save to WordPress Formidable API
      const savedRecord = await saveToWordPress(registrationRecord);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Registration data stored to WordPress successfully (payment not completed).',
          data: savedRecord 
        },
        { status: 200 }
      );
    }
    
  } catch (error: any) {
    console.error('Error processing payment/registration:', error);
    
    // Handle JSON parsing errors or unexpected server issues
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof SyntaxError ? 'Invalid JSON payload' : error.message,
        stack: error.stack
      },
      { status: error instanceof SyntaxError ? 400 : 500 }
    );
  }
}
