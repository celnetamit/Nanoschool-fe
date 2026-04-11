import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const entries = await getFormEntries(673);
    
    const payments = entries.map((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const formattedAmount = String(meta['ijpy8'] || meta['p30ad'] || '0');
      const amountRaw = formattedAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountRaw) || 0;
      const status = (meta['2dnu4'] === 'payment_success' || meta['payment_success'] === 'success') ? 'Paid' : 'Unpaid';
      
      const transactionId = meta['m80xc'] || meta['payment_id'] || 'N/A';

      return {
        id: e.id,
        name: meta['wly6y'] || 'Unknown',
        email: meta['7yfjv'] || 'N/A',
        course: meta['mlsd4'] || 'Generic Enrollment',
        status,
        amount,
        formattedAmount,
        transactionId,
        state: meta['q2ct5'] || '',
        country: meta['yiu1i'] || '',
        address: meta['kt4ba'] || '',
        contactNumber: meta['ycnup'] || '',
        institution: meta['7bm3p'] || '',
        pid: meta['ysfj2'] || `NSTC-${e.id.slice(-4).toUpperCase()}`,
        zipCode: meta['dnoob'] || '',
        date: e.created_at
      };
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('Admin payments API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }
}
