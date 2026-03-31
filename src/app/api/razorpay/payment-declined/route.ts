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
        console.log('[INFO] WordPress entry updated to payment_failed for entryId:', entryId);
      }
    } catch (wpError) {
      console.error('WordPress PATCH failed on payment decline:', wpError);
    }

    // Step 2: Notify IMS about the payment failure via the registration webhook
    try {
      const numericMeta = Object.fromEntries(
        Object.entries(itemMeta || {}).filter(([key]) => /^\d+$/.test(key))
      );

      const webhookPayload = {
        companyId: "3a148605-aa1c-42b4-8ab8-f78c039ee9c0",
        brandId: "fbb632ae",
        ...numericMeta,
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
        console.log('[INFO] IMS notified of payment failure for entryId:', entryId);
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
