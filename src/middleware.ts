import { NextResponse, type NextRequest } from "next/server";

import { getAdminEmails } from "@/lib/env";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirectToLogin(request);
  }

  if (!getAdminEmails().length || !isAdminEmail(user.email)) {
    return redirectToHome(request);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
