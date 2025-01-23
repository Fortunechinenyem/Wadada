import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.authToken;

  if (!token) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
