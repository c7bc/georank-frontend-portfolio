import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  cookieStore.delete({ name: 'access_token', path: '/', domain: cookieDomain });
  cookieStore.delete({ name: 'refresh_token', path: '/', domain: cookieDomain });

  const loginUrl = new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  return NextResponse.redirect(loginUrl);
}
