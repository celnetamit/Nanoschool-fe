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
  const role = (session.user as any).role;

  try {
    const [enrollmentEntries, workshopEntries] = await Promise.all([
      getFormEntries(673),
      getFormEntries(672)
    ]);

    // Combine and Re-categorize based on Robust Logic
    const allRawEntries = [
        ...enrollmentEntries.map(e => ({ ...e, formId: 673 })),
        ...workshopEntries.map(e => ({ ...e, formId: 672 }))
    ];

    // Normalized lists
    const finalEnrollments: any[] = [];
    const finalWorkshops: any[] = [];

    allRawEntries.forEach((e: any) => {
        const meta = e.meta || e.item_meta || {};
        const entryEmail = (
            meta['9793'] || meta['9772'] || meta['7yfjv'] || meta['l0s01'] || meta['7877'] || ''
        ).toLowerCase();

        // 1. Ownership Check (RESTORED SECURITY GUARD)
        if (role !== 'admin' && entryEmail !== userEmail) return;

        // 2. Intelligence Layer V3 (Universal Signature & Keyword Detection)
        const courseTitleLower = (meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['7881'] || '').toLowerCase();
        const explicitCategory = String(meta['vtajg'] || meta['9823'] || '').toLowerCase();
        const isWorkshopSignature = !!(meta['9770'] || meta['9772'] || meta['9768'] || meta['9769']);
        const workshopKeywords = ['workshop', 'masterclass', 'bootcamp', 'training', 'session'];
        const hasWorkshopKeyword = workshopKeywords.some(kw => courseTitleLower.includes(kw));
        
        if (e.formId === 672 || explicitCategory === 'workshop' || isWorkshopSignature || hasWorkshopKeyword) {
            finalWorkshops.push(e);
        } else {
            finalEnrollments.push(e);
        }
    });

    return NextResponse.json({ 
      success: true, 
      enrollments: finalEnrollments, 
      workshops: finalWorkshops 
    });
  } catch (error) {
    console.error('User enrollments API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch your enrollments' }, { status: 500 });
  }
}
