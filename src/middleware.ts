import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, SESSION_NAME } from '@/lib/session-token';

// Add paths that should be protected
const protectedRoutes = ['/dashboard'];
// Add paths that should be redirected to dashboard if already logged in
const authRoutes = ['/login', '/registro'];

export async function middleware(request: NextRequest) {
    const { nextUrl, cookies } = request;
    const session = cookies.get(SESSION_NAME)?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }

        const payload = await decrypt(session);
        if (!payload) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
    }

    if (isAuthRoute && session) {
        const payload = await decrypt(session);
        if (payload) {
            return NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/registro'],
};
