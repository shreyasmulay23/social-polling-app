import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({req: request, res})
    const {
        data: {session},
    } = await supabase.auth.getSession()


    console.log('Middleware - Path:', request.nextUrl.pathname);
    console.log('Middleware - Session exists:', !!session);

// Auth pages
    if (request.nextUrl.pathname.startsWith('/auth')) {
        return res;
    }

    // Redirect if authenticated
    if (['/login', '/signup'].includes(request.nextUrl.pathname)) {
        if (session) {
            console.log('Redirecting to dashboard from login');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return res;
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            console.log('Redirecting to login from protected route');
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return res;
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
}