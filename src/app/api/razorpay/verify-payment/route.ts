import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      entryId,
      itemMeta
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

    // Trigger Success Webhook with clean numeric keys only
    try {
      const numericMeta = Object.fromEntries(
        Object.entries(itemMeta || {}).filter(([key]) => /^\d+$/.test(key))
      );

      const webhookPayload = {
        companyId: "3a148605-aa1c-42b4-8ab8-f78c039ee9c0",
        brandId: "fbb632ae",
        ...numericMeta,
        [PAYMENT_STATUS_FIELD]: 'success',
        [RZP_ORDER_ID_FIELD]: razorpay_order_id,
        [RZP_PAYMENT_ID_FIELD]: razorpay_payment_id,
        [RZP_SIGNATURE_FIELD]: razorpay_signature,
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
        console.error('Verify-payment Webhook rejected payload:', whRes.status, whErrText);
      }
      console.log('Verify-payment Webhook success:', whRes.status);
    } catch (whError) {
      console.error('Webhook failed:', whError);
      // We don't fail the verification if the webhook fails, but we log the error
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
