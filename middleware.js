import { NextResponse } from 'next/server'
import { CookieCore } from './utils/lib/cookie';

// This function can be marked `async` if using `await` inside
export async function middleware(request, event) {
    const { pathname, origin } = request.nextUrl;
    const token = request.cookies.get("tokenFMRP") ?? ""
    const databaseappFMRP = request.cookies.get("databaseappFMRP") ?? ""
    // event.waitUntil(
    //     fetch(`${process.env.NEXT_PUBLIC_URL_API}/api_web/Api_Authentication/authentication?csrf_protection=true`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token?.value}`,
    //             "x-api-key": databaseappFMRP?.value
    //         },
    //         signal: event.signal
    //     }).then(async (res) => {
    //         const data = await res.json();
    //         if (data.isSuccess) {
    //             return NextResponse.next();
    //         } else {
    //             CookieCore.remove("tokenFMRP");
    //             CookieCore.remove("databaseappFMRP");
    //         }
    //     })
    // )
    // const session = request.cookies.get('session');

    // if (!session) {
    //     const newSession = 'your-session-id'; // Tạo ID phiên làm việc
    //     const response = NextResponse.next();
    //     response.cookies.set('session', newSession, {
    //         path: '/',
    //         sameSite: 'None', // Cho phép cookie từ miền khác
    //         secure: true, // Chỉ sử dụng cookie qua HTTPS
    //     });

    //     return response;
    // }
    // console.log("response", session);
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
            return NextResponse.next();
        } else {
            CookieCore.remove("tokenFMRP");
            CookieCore.remove("databaseappFMRP");
        }
    } catch (error) {
    }

    if (pathname.startsWith("/")) {
        if ((!token || token == "" || token?.value == "") || (!databaseappFMRP || databaseappFMRP == "" || databaseappFMRP?.value == "")) {
            return NextResponse.next();
        }
        return NextResponse.next();
    }
    return NextResponse.next();
}

// // See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*',
}