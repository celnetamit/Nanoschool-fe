import { NextResponse } from 'next/server';
import { getEnrollmentsByEmail } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email?.toLowerCase();

  try {
    const enrollments = await getEnrollmentsByEmail(userEmail!);

    if (enrollments.length === 0) {
      return NextResponse.json({ success: true, profile: null });
    }

    // Sort by creation date descending to get the most recent one
    const recent = enrollments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const meta = recent.meta || recent.item_meta || {};

    const profile = {
      name: meta['wly6y'] || meta['9792'] || session.user.name,
      mobileNumber: meta['9795'] || meta['mobile'] || '',
      currentAffiliation: meta['9796'] || meta['affiliation'] || '',
      address: meta['9800'] || meta['address'] || '',
      state: meta['9801'] || meta['state'] || '',
      country: meta['9802'] || meta['country'] || '',
      pinCode: meta['9803'] || meta['pincode'] || '',
      designation: meta['9797'] || meta['designation'] || '',
      profession: meta['profession'] || ''
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('User profile API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
