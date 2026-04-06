import { NextResponse } from 'next/server';

const PAYMENT_STATUS_FIELD = '9817';
const RZP_ORDER_ID_FIELD = '9816';

export async function POST(request: Request) {
  try {
    const { entryId, itemMeta, razorpay_order_id } = await request.json();

    if (!entryId) {
      return NextResponse.json({ error: 'Missing entryId' }, { status: 400 });
    }

    const WP_USER = process.env.WP_USER;
    const WP_PASSWORD = process.env.WP_PASSWORD;
    const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
    const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';

    const RZP_PAYMENT_ID_FIELD = '9819';
    const RZP_SIGNATURE_FIELD = '9821';

    // Step 1: Update the WordPress entry status to 'payment_failed'
    try {
      const updateResponse = await fetch(`${FORMIDABLE_API_URL}/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          item_meta: {
            [PAYMENT_STATUS_FIELD]: 'payment_failed',
            [RZP_ORDER_ID_FIELD]: razorpay_order_id || '',
            [RZP_PAYMENT_ID_FIELD]: '',
            [RZP_SIGNATURE_FIELD]: '',
          }
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        console.error('Failed to update WordPress entry on decline:', errorData);
      } else {

      }
    } catch (wpError) {
      console.error('WordPress PATCH failed on payment decline:', wpError);
    }

    // Trigger Failure Webhook with full data coverage (IDs and Named keys)
    try {
      const webhookPayload = {
        companyId: "3a148605-aa1c-42b4-8ab8-f78c039ee9c0",
        brandId: "fbb632ae",
        ...(itemMeta || {}), // Capture all entry metadata (IDs and Name keys)
        courseFee: itemMeta?.['9809'] || '',
        payableAmount: itemMeta?.['9810'] || '',
        payableFeeAmount: itemMeta?.['9810'] || '', // User's specific naming request
        currency: (itemMeta?.['9810'] || '').includes('₹') ? 'INR' : 'USD',
        [PAYMENT_STATUS_FIELD]: 'failed',
        [RZP_ORDER_ID_FIELD]: razorpay_order_id || '',
        [RZP_PAYMENT_ID_FIELD]: '',
        [RZP_SIGNATURE_FIELD]: '',
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
        console.error('IMS decline webhook rejected:', whRes.status, whErrText);
      } else {

      }
    } catch (whError) {
      console.error('IMS decline webhook failed:', whError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in payment-declined route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment decline' },
      { status: 500 }
    );
  }
}
