import { NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/fetch-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';
    const formId = 554;

    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_PASSWORD;

    if (!wpUser || !wpPassword) {
      console.error('Missing WordPress credentials in .env');
      return NextResponse.json(
        { error: 'Server configuration error: Missing WP credentials' },
        { status: 500 }
      );
    }

    // Map your frontend field names to Formidable field IDs for Form 554.
    // Verified via live site inspection (item_meta names).
    const itemMeta: Record<string, string | number | string[]> = {
      '7881': body.projectTitle || '',       // Project Name / Title
      '7970': body.internshipId || '',      // Internship iD
      '7876': body.fullName || '',          // Full Name
      '7877': body.email || '',             // Email
      '7878': body.phone || '',             // Phone
      '7980': body.address || '',           // Full Address
      '7882': body.affiliation || '',       // Affiliation/Institution
      '7979': body.country || '',           // Country
      '7924': body.education || '',         // Education
      '7925': body.majorCourse || '',       // Major Course / Department
      '7981': body.mode || '',              // Mode
      '7982': body.duration || '',          // Duration
      '7931': body.knowNstcThrough || '',   // Referral (Verified as 7931)
      '9127': 'Pending',                    // Payment
      '7932': body.declaration 
        ? 'I hereby declare that, the above furnished information is true to my knowledge and I will abide by the Terms & Conditions of NSTC Centre for Science and Technology.' 
        : ''                                // Declaration (Verified as 7932 + Exact String)
    };

    const payload = {
      form_id: formId,
      item_meta: itemMeta
    };

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    
    // Using fetchWithTimeout for robust connectivity to WordPress
    const response = await fetchWithTimeout(FORMIDABLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
      timeoutMs: 30000, // 30s timeout for stability
      retries: 2        // 2 automatic retries on failure
    });

    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const errorText = await response.text();
      console.error('Formidable API returned non-JSON response:', response.status, errorText);
      return NextResponse.json(
        { error: 'Backend connectivity issue (Non-JSON response).' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error('Formidable API Error Details:', result);
      return NextResponse.json(
        { error: result.message || 'Failed to submit form to backend.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    console.error('Error in Internship Application API Route:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred processing your application.',
        details: error.message || 'Unknown server error'
      },
      { status: 500 }
    );
  }
}
