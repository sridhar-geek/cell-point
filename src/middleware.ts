import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

          /* This is old middleware */
// export function middleware(request: NextRequest) {
//   const url = request.nextUrl.pathname;
//   const token = null;
//   const { pathname } = request.nextUrl;
//   const publicRoutes = ["/", "/login"];
//   const restrictedRoutes = ["/login"];

//   if (token && restrictedRoutes.includes(url)) {
//     return NextResponse.redirect(new URL("/admin/products", request.url));
//   }

//   // Check if the user is accessing a public route
//   if (publicRoutes.includes(pathname) || pathname.startsWith("/product/")) {
//     return NextResponse.next();
//   }
//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }



export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/", "/login"];
  const restrictedRoutes = ["/login"];

  // Retrieve session data from cookies
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("supabaseSession")?.value;
  const session = sessionData ? JSON.parse(sessionData) : null;
  const token = session ? session.access_token : null;
  const expiresAt = session ? session.expires_at : null;

  // Check if the token is valid and not expired
  const isTokenValid =
    token && expiresAt && expiresAt > Math.floor(Date.now() / 1000);

  if (isTokenValid && restrictedRoutes.includes(url)) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  // Check if the user is accessing a public route
  if (publicRoutes.includes(pathname) || pathname.startsWith("/product/")) {
    return NextResponse.next();
  }

  if (!isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
