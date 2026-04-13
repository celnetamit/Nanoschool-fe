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
    // Fetch from both 673 (General/Advanced) and 672 (Workshops)
    const [entries673, entries672] = await Promise.all([
      getFormEntries(673),
      getFormEntries(672)
    ]);
    
    // Combine and normalize entries
    const allEntries = [
        ...entries673.map(e => ({ ...e, formId: 673 })),
        ...entries672.map(e => ({ ...e, formId: 672 }))
    ];

    // Filter entries by current user's email
    const myEntries = allEntries.filter((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const entryEmail = (
        meta['9793'] || meta['9772'] || // 2024 Numeric
        meta['7yfjv'] || meta['l0s01'] || meta['7877'] || // Legacy string keys
        ''
      ).toLowerCase();
      return entryEmail === userEmail;
    });

    const payments = myEntries.map((e: any) => {
      const meta = e.meta || e.item_meta || {};
      
      // Robust Name detection
      const name = meta['wly6y'] || meta['9792'] || meta['9771'] || meta['u5108'] || meta['7876'] || 'Student';
      
      // Robust Course detection (Universal V3)
      const course = meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['l9w7q'] || meta['7881'] || 'NanoSchool Program';
      
      // Robust Pricing detection
      const formattedAmount = String(meta['p30ad'] || meta['ijpy8'] || meta['9810'] || meta['9777'] || '0');
      const amountRaw = formattedAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountRaw) || 0;
      
      // Robust Status detection
      const rawStatus = (meta['2dnu4'] || meta['9817'] || meta['9777'] || '').toLowerCase();
      const status = (rawStatus === 'paid' || rawStatus === 'payment_success' || rawStatus === 'success') ? 'Paid' : 'Unpaid';
      
      // Robust Transaction ID detection
      const transactionId = meta['vdgya'] || meta['m80xc'] || meta['9819'] || meta['9816'] || meta['payment_id'] || 'N/A';

      // Robust Category detection (Intelligence Layer V3)
      const explicitCategory = String(meta['vtajg'] || meta['9823'] || '').toLowerCase();
      const isWorkshopSignature = !!(meta['9770'] || meta['9772'] || meta['9768'] || meta['9769']);
      const workshopKeywords = ['workshop', 'masterclass', 'bootcamp', 'training', 'session'];
      const hasWorkshopKeyword = workshopKeywords.some(kw => course.toLowerCase().includes(kw));
      
      const category = (e.formId === 672 || explicitCategory === 'workshop' || isWorkshopSignature || hasWorkshopKeyword) ? 'Workshop' : 'Course';

      return {
        id: e.id,
        name,
        email: userEmail,
        course,
        category,
        status,
        amount,
        formattedAmount,
        transactionId,
        state: meta['9801'] || meta['9775'] || meta['q2ct5'] || '',
        country: meta['9802'] || meta['9776'] || meta['yiu1i'] || '',
        address: meta['kt4ba'] || meta['9800'] || meta['9774'] || '',
        contactNumber: meta['ycnup'] || meta['9794'] || meta['9773'] || meta['jqnig'] || '',
        institution: meta['238v0'] || meta['9795'] || meta['2mjze'] || '',
        pid: meta['ysfj2'] || meta['9788'] || meta['9769'] || `NSTC-${e.id.slice(-4).toUpperCase()}`,
        zipCode: meta['dnoob'] || meta['9805'] || '',
        date: e.created_at
      };
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('User payments API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch your payments' }, { status: 500 });
  }
}
