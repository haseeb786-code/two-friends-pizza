import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'twofriends123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.set('tf_admin_session', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0
      });
      return response;
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('tf_admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Incorrect admin password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
