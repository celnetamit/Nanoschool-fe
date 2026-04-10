import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Optional: Add custom logic here
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/dashboard/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/dashboard/:path*",
  ],
};
