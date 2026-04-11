import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email?.toLowerCase();

  try {
    // Form 673 is the specialized enrollment/payment form
    const entries = await getFormEntries(673);
    
    // Filter entries by current user's email
    const myEntries = entries.filter((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const entryEmail = (meta['7yfjv'] || meta['9793'] || '').toLowerCase();
      return entryEmail === userEmail;
    });

    const payments = myEntries.map((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const formattedAmount = String(meta['ijpy8'] || meta['9810'] || '0');
      const amountRaw = formattedAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountRaw) || 0;
      const status = (meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success') ? 'Paid' : 'Unpaid';
      
      const transactionId = meta['payment_id'] || meta['transaction_id'] || 'N/A';

      return {
        id: e.id,
        name: meta['wly6y'] || meta['9792'] || 'Unknown',
        email: meta['7yfjv'] || meta['9793'] || 'N/A',
        course: meta['mlsd4'] || meta['9789'] || 'Generic Enrollment',
        status,
        amount,
        formattedAmount,
        transactionId,
        state: meta['9801'] || meta['state'] || '',
        country: meta['9802'] || meta['country'] || '',
        address: meta['9800'] || meta['address'] || '',
        contactNumber: meta['9795'] || meta['mobile'] || '',
        institution: meta['9796'] || meta['affiliation'] || '',
        date: e.created_at
      };
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('User payments API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch your payments' }, { status: 500 });
  }
}
