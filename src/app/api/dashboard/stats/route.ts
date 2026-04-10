import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const role = (session.user as any).role;
  const user = session.user.email!;

  try {
    const entries = await getFormEntries(673);
    
    // If student, filter entries to only their own
    const filteredEntries = role === 'admin' 
      ? entries 
      : entries.filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['7yfjv'] || meta['9793'];
          return email?.toLowerCase() === user.toLowerCase();
        });

    const stats = {
      total: role === 'admin' ? entries.length : filteredEntries.length,
      paid: 0,
      unpaid: 0,
      revenue: 0,
      recent: filteredEntries.slice(0, 10).map((e: any) => {
        const meta = e.meta || e.item_meta || {};
        const formattedAmount = String(meta['ijpy8'] || meta['9810'] || '0');
        const amountStr = formattedAmount.replace(/[^0-9.]/g, '');
        const amount = parseFloat(amountStr) || 0;
        const status = (meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success') ? 'Paid' : 'Unpaid';

        return {
          id: e.id,
          name: meta['wly6y'] || meta['9792'] || 'Unknown',
          email: meta['7yfjv'] || meta['9793'] || 'N/A',
          course: meta['mlsd4'] || meta['9789'] || 'Generic Enrollment',
          status,
          amount,
          formattedAmount,
          date: e.created_at
        };
      })
    };

    // Calculate totals based on the original entries for admin, or filtered for user
    const entriesToSummarize = role === 'admin' ? entries : filteredEntries;
    entriesToSummarize.forEach((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const amountStr = String(meta['ijpy8'] || meta['9810'] || '0').replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr) || 0;
      const isPaid = meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success';

      if (isPaid) {
        stats.paid++;
        stats.revenue += amount;
      } else {
        stats.unpaid++;
      }
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
