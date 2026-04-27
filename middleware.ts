import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route yang hanya bisa diakses setelah login
const protectedRoutes = [
  '/dashboard', '/members', '/announcements', '/financial', '/documents', '/settings', '/payment'
];

// Route yang HANYA untuk admin (bukan warga)
const adminOnlyRoutes = ['/members', '/documents', '/settings'];

// Route yang publik (tidak perlu login)
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip untuk static assets & API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Ambil token dari cookie (dipasang oleh auth-context saat login)
  const token = request.cookies.get('civichub_token')?.value;
  const roleFromCookie = request.cookies.get('civichub_role')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

  // Redirect ke login jika belum ada token dan mencoba akses protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect Warga yang coba akses halaman admin-only ke /financial (portal warga)
  if (isAdminOnlyRoute && roleFromCookie === 'warga') {
    return NextResponse.redirect(new URL('/financial', request.url));
  }

  // Jika sudah login dan mencoba akses /login, redirect ke dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp).*)',
  ],
};
