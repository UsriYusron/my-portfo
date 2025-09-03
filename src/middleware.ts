// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"], // semua route dashboard butuh login
};
