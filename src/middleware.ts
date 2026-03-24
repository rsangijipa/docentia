import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, SESSION_NAME } from '@/lib/session-token';

// Add paths that should be protected
const protectedRoutes = ['/dashboard'];
// Add paths that should be redirected to dashboard if already logged in
const authRoutes = ['/login', '/registro'];

import { getRequestId } from '@/lib/request-trace';

export async function middleware(request: NextRequest) {
    const { nextUrl, cookies, headers } = request;
    const session = cookies.get(SESSION_NAME)?.value;
    const requestId = getRequestId(headers);

    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    let response = NextResponse.next();

    if (isProtectedRoute) {
        if (!session) {
            response = NextResponse.redirect(new URL('/login', nextUrl));
        } else {
            const payload = await decrypt(session);
            if (!payload) {
                response = NextResponse.redirect(new URL('/login', nextUrl));
            }
        }
    } else if (isAuthRoute && session) {
        const payload = await decrypt(session);
        if (payload) {
            response = NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
    }

    response.headers.set('x-request-id', requestId);
    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/registro'],
};
