import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getEnrollmentsByEmail } from '@/lib/wordpress';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (role === 'admin') {
      // Validate Admin credentials
      // Using the WP_USER email as the admin email for this demo
      const adminEmail = process.env.WP_USER || 'amit.rai@celnet.in';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123'; // Set to admin@123 as requested

      if (email === adminEmail && password === adminPassword) {
        (await cookies()).set('ns_role', 'admin', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
        (await cookies()).set('ns_user', email, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
        
        return NextResponse.json({ success: true, role: 'admin' });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
      }
    } else {
      // Validate Student (User) by checking their email in Formidable Form 673
      const enrollments = await getEnrollmentsByEmail(email);

      if (enrollments && enrollments.length > 0) {
        (await cookies()).set('ns_role', 'user', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
        (await cookies()).set('ns_user', email, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

        return NextResponse.json({ success: true, role: 'user' });
      } else {
        return NextResponse.json({ success: false, error: 'No enrollment found with this email. Please register first.' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  (await cookies()).delete('ns_role');
  (await cookies()).delete('ns_user');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('ns_role')?.value;
  const user = cookieStore.get('ns_user')?.value;

  if (!role || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, role, user });
}