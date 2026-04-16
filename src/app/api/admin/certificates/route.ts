import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getSystemConfig } from '@/lib/settings';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');

  if (!entryId) {
    return NextResponse.json({ success: false, error: 'Entry ID is required' }, { status: 400 });
  }

  try {
    // We search in both common forms
    const [courses, internships] = await Promise.all([
      getFormEntries(673),
      getFormEntries(554)
    ]);

    const allEntries = [...courses, ...internships];
    const entry = allEntries.find(e => String(e.id) === entryId);

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    const type = entry.form_id === 554 ? 'Internship' : 'Academy Program';
    const meta = entry.meta || entry.item_meta || {};
    const productTitle = meta['9789'] || meta['mlsd4'] || meta['9770'] || meta['7881'] || meta['l9w7q'] || 'Academy Program';

    const certificate = normalizeCertificate(entry, type, productTitle);

    return NextResponse.json({ 
      success: true, 
      certificate 
    });
  } catch (error) {
    console.error('Admin Certificate API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch certificate' }, { status: 500 });
  }
}

function normalizeCertificate(e: any, type: string, explicitTitle?: string) {
  const meta = e.meta || e.item_meta || {};
  let title = explicitTitle || 'Professional Certificate';
  
  const config = getSystemConfig();
  const prefix = config.certificate.prefix || 'NS';
  const year = config.certificate.year || '2026';
  const credentialId = `${prefix}-${year}-${String(e.id).padStart(5, '0')}`;

  return {
    id: e.id,
    title,
    type,
    issueDate: e.created_at,
    credentialId,
    status: 'Verified (Admin)',
    recipientName: meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || 'Learner'
  };
}
