import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');

  if (!entryId) {
    return NextResponse.json({ success: false, error: 'Entry ID is required' }, { status: 400 });
  }

  const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';
  const wpUser = process.env.WP_USER;
  const wpPassword = process.env.WP_PASSWORD;

  if (!wpUser || !wpPassword) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    const response = await fetch(`${FORMIDABLE_API_URL}/${entryId}`, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}`);
    }

    const entry = await response.json();
    const meta = entry.meta || entry.item_meta || {};

    // Validate ownership before returning (Trim for robustness)
    const entryEmail = (
        meta['7yfjv'] || meta['9793'] || meta['9772'] || meta['l0s01'] || meta['7877'] || ''
    ).toString().trim().toLowerCase();

    const currentUserEmail = session.user.email?.toLowerCase().trim();

    if (entryEmail !== currentUserEmail && (session.user as any).role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    // Unpack fields safely using known keys (Trim all strings) - Priority given to user-provided keys
    const data = {
        name: (meta['wly6y'] || meta['9792'] || meta['9771'] || '').toString().trim(),
        email: entryEmail,
        mobileNumber: (meta['ycnup'] || meta['9794'] || meta['9773'] || '').toString().trim(),
        currentAffiliation: (meta['238v0'] || meta['9795'] || meta['2mjze'] || '').toString().trim(),
        profession: (meta['1vmh9'] || meta['9796'] || '').toString().trim(),
        designation: (meta['zssx9'] || meta['9797'] || '').toString().trim(),
        address: (meta['kt4ba'] || meta['9800'] || meta['9774'] || '').toString().trim(),
        state: (meta['q2ct5'] || meta['9801'] || meta['9775'] || '').toString().trim(),
        country: (meta['yiu1i'] || meta['9802'] || meta['9776'] || '').toString().trim(),
        pinCode: (meta['dnoob'] || meta['9805'] || '').toString().trim(),
        gstVatNo: (meta['jew3g'] || meta['9806'] || '').toString().trim(),
        hasCoupon: (meta['oxnht'] || meta['9811'] || 'No').toString().trim(),
        couponCode: (meta['b9ifk'] || meta['9815'] || '').toString().trim(),
        otherCurrency: (meta['r3ksl'] || meta['9812'] || 'No').toString().trim(),
        referralSource: (meta['aixfs'] || meta['9814'] || '').toString().trim(),
        learningMode: (meta['7bm3p'] || meta['9824'] || '').toString().trim(),
        pid: (meta['ysfj2'] || meta['9788'] || meta['9769'] || '').toString().trim()
    };

    return NextResponse.json({ success: true, entry: data }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching formidable entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch entry' }, { status: 500 });
  }
}
