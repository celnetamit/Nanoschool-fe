import { NextResponse } from 'next/server';

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
    const itemMeta: Record<string, string | number | string[]> = {
      '66qvj': body.internshipId || '',
      '8vudu': body.applicationId || '',
      'l9w7q': body.projectTitle || '',
      '5ycy8': body.mode || '',
      'osn4c': body.duration || '',
      'u5108': body.fullName || '',
      'l0s01': body.email || '',
      'jqnig': body.phone || '',
      'urskg': body.address || '',
      '2mjze': body.affiliation || '',
      '7j5ww': body.country || '',
      'c5s53': body.education || '',
      'zsrzh': body.majorCourse || '',
      '4fkgw': body.knowNstcThrough || '',
      'heb09': body.declaration ? 'I agree to the Terms & Conditions' : ''
    };

    const payload = {
      form_id: formId,
      item_meta: itemMeta
    };

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;
    const response = await fetch(FORMIDABLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
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
