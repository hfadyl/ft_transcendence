import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const pages = [
  "/game",
  "/messages",
  "/friends",
  "/settings",
  "/blockList",
  "/matchHistory",
  "/login/username",
];

function allowedPages(name: string): boolean {
  if ("/" === name) return true;
  let result = false;
  pages.forEach((page) => {
    if (name.includes(page)) {
      result = true;
      return;
    }
  });
  return result;
}

export default async function middleware(req: NextRequest) {
  const jwt = req.cookies.get("jwt");
  const checkJwt = req.cookies.get("checkJwt");

  if (req.nextUrl.pathname === "/login") {
    if (checkJwt) {
      try {
        await jwtVerify(checkJwt?.value, new TextEncoder().encode(process.env.CHECK_JWT_SECRET));
        return NextResponse.redirect(`${process.env.CLIENT_URL}/login/qrcode`);
      } catch (error) {
        return NextResponse.next();
      }
    } else if (jwt) {
      try {
        await jwtVerify(jwt?.value, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.redirect(`${process.env.CLIENT_URL}`);
      } catch (error) {
        return NextResponse.next();
      }
    }
  }
  if (req.nextUrl.pathname === "/login/qrcode") {
    if (checkJwt) {
      try {
        await jwtVerify(checkJwt?.value, new TextEncoder().encode(process.env.CHECK_JWT_SECRET));
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(`${process.env.CLIENT_URL}/login`);
      }
    } else if (jwt) {
      try {
        await jwtVerify(jwt?.value, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.redirect(`${process.env.CLIENT_URL}`);
      } catch (error) {
        return NextResponse.next();
      }
    } else return NextResponse.redirect(`${process.env.CLIENT_URL}/login`);
  }
  if (allowedPages(req.nextUrl.pathname)) {
    if (jwt === undefined) return NextResponse.redirect(`${process.env.CLIENT_URL}/login`);
    try {
      await jwtVerify(jwt?.value, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }
  return NextResponse.next();
}
