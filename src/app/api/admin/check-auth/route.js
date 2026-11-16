import { NextResponse } from "next/server";
import { verifySessionToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const token = req.cookies.get("mex_admin_token")?.value;
  const isAuthenticated = verifySessionToken(token);

  return NextResponse.json({
    success: true,
    authenticated: isAuthenticated,
  });
}
