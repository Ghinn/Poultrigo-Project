import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-key')

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const { pathname } = request.nextUrl

    // Public paths that don't require auth
    if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/api/public')) {
        if (session && pathname.startsWith('/login')) {
            // If already logged in, redirect to role-specific dashboard
            try {
                const { payload } = await jwtVerify(session, SECRET)
                const role = payload.role as string
                if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
                if (role === 'operator') return NextResponse.redirect(new URL('/operator', request.url))
                if (role === 'guest') return NextResponse.redirect(new URL('/guest', request.url))
            } catch {
                // Invalid token, let them stay on login
            }
        }
        return NextResponse.next()
    }

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const { payload } = await jwtVerify(session, SECRET)
        const role = payload.role as string

        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (pathname.startsWith('/operator') && role !== 'operator') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (pathname.startsWith('/guest') && role !== 'guest') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        return NextResponse.next()
    } catch {
        // Invalid token
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('session')
        return response
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
