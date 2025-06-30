import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { auth } from './auth';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default auth((req: NextRequest & { auth: any }) => {
  // Handle internationalization
  const response = intlMiddleware(req);

  // Get the pathname without locale
  const pathname = req.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (req.auth?.user && (pathname.includes('/login') || pathname.includes('/signup'))) {
    const homeUrl = new URL('/en', req.url);
    return Response.redirect(homeUrl);
  }

  // Check if user is trying to access protected routes
  if (pathname.includes('/profile') || pathname.includes('/settings')) {
    if (!req.auth?.user) {
      const loginUrl = new URL('/en/login', req.url);
      return Response.redirect(loginUrl);
    }
  }

  // Check if user is trying to access admin routes
  if (pathname.includes('/admin')) {
    if (!req.auth?.user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/en/login', req.url);
      return Response.redirect(loginUrl);
    }

    // Check if user is admin
    if (req.auth.user.role !== 'ADMIN' && req.auth.user.email !== process.env.ADMIN_EMAIL) {
      // Redirect to home if not admin
      const homeUrl = new URL('/en', req.url);
      return Response.redirect(homeUrl);
    }
  }

  // Check if user is trying to access dashboard
  if (pathname.includes('/dashboard')) {
    if (!req.auth?.user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/en/login', req.url);
      return Response.redirect(loginUrl);
    }

    // Check if user is seller
    if (req.auth.user.role !== 'SELLER') {
      // Redirect to home if not seller
      const homeUrl = new URL('/en', req.url);
      return Response.redirect(homeUrl);
    }
  }

  return response;
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
