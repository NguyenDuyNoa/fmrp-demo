import { NextResponse } from 'next/server'
import { CookieCore } from './utils/lib/cookie';

export async function middleware(request, event) {
    const { pathname, origin } = request.nextUrl;

    const token = request.cookies.get("tokenFMRP") ?? ""

    const databaseappFMRP = request.cookies.get("databaseappFMRP") ?? ""

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api_web/Api_Authentication/authentication?csrf_protection=true`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`,
                "x-api-key": databaseappFMRP?.value
            },
            signal: event.signal
        });

        const data = await response.json();
        if (data.isSuccess) {
            // return NextResponse.next();
            if ((!token || token == "" || token?.value == "") || (!databaseappFMRP || databaseappFMRP == "" || databaseappFMRP?.value == "")) {
                if ((pathname.startsWith('/manufacture/productions-orders-mobile')) || pathname.startsWith("/manufacture/production-plan-mobile")) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL_API_AUTH_LOGIN}`);
            } else {
                if ((pathname.startsWith('/manufacture/productions-orders-mobile')) || pathname.startsWith("/manufacture/production-plan-mobile")) {
                    return NextResponse.next();
                }
                if (pathname.startsWith("/auth")) {
                    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL_API_DASHBOARD}`);
                }
                return NextResponse.next();
            }
        } else {
            if ((pathname.startsWith('/manufacture/productions-orders-mobile')) || pathname.startsWith("/manufacture/production-plan-mobile")) {
                return NextResponse.next();
            }
            CookieCore.remove("tokenFMRP");
            CookieCore.remove("databaseappFMRP");
            // return NextResponse.redirect(new URL("/auth/login", request.url))
        }
    } catch (error) {
    }

    if (pathname.startsWith("/")) {
        if ((!token || token == "" || token?.value == "") || (!databaseappFMRP || databaseappFMRP == "" || databaseappFMRP?.value == "")) {
            return NextResponse.next();
        } else {
            if (pathname.startsWith("/auth")) {
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL_API_DASHBOARD}`);
            }
            return NextResponse.next();
        }

    }
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
}