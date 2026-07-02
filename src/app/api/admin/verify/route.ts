import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    const adminKey = process.env.ADMIN_AUTH_KEY;

    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
