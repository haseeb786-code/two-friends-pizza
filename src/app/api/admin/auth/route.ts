import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'twofriends123';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authenticated = cookieHeader.includes('tf_admin_session=authenticated');
    return NextResponse.json({ success: true, authenticated });
  } catch (error: any) {
    return NextResponse.json({ success: false, authenticated: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.set('tf_admin_session', '', {
        path: '/',
        httpOnly: false,
        maxAge: 0,
      });
      return response;
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('tf_admin_session', 'authenticated', {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Incorrect admin password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
