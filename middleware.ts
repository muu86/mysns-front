import { auth } from 'auth';
import { NextResponse } from 'next/server';

const protectedRoutes = [/\/post\/[^\/]/, /\/chat/, /\/newchat/, /^\/user\/[^\/]+\/m$/];

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth?.user?.username;
  const isProtected = protectedRoutes.find((r) => r.test(nextUrl.pathname));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
