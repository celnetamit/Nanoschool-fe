import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      entryId 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Payment verified! Now update the Formidable entry in WordPress
    // We update the entry status to 'payment_success' and save payment IDs
    
    // UPDATABLE FIELDS (Replace these IDs with real ones after user adds them)
    const PAYMENT_STATUS_FIELD = '9817'; 
    const RZP_ORDER_ID_FIELD = '9816';
    const RZP_PAYMENT_ID_FIELD = '9819';
    const RZP_SIGNATURE_FIELD = '9821';

    const WP_USER = process.env.WP_USER;
    const WP_PASSWORD = process.env.WP_PASSWORD;
    const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;

    const updateResponse = await fetch(`https://nanoschool.in/wp-json/frm/v2/entries/${entryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        item_meta: {
          [PAYMENT_STATUS_FIELD]: 'payment_success',
          [RZP_ORDER_ID_FIELD]: razorpay_order_id,
          [RZP_PAYMENT_ID_FIELD]: razorpay_payment_id,
          [RZP_SIGNATURE_FIELD]: razorpay_signature,
        }
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Failed to update Formidable entry:', errorData);
      return NextResponse.json({ error: 'Payment verified but failed to update entry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
