import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import crypto from "node:crypto";
import { trackVisitor } from "@/lib/visitors";

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  if (ua) {
    if (ua.includes("Firefox") && !ua.includes("Seamonkey")) {
      browser = "Firefox";
    } else if (ua.includes("Edg") || ua.includes("Edge")) {
      browser = "Edge";
    } else if (ua.includes("OPR") || ua.includes("Opera") || ua.includes("OPT")) {
      browser = "Opera";
    } else if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browser = "Chrome";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = "Safari";
    }

    if (ua.includes("Windows")) {
      os = "Windows";
    } else if (ua.includes("Mac OS") && !ua.includes("iOS")) {
      os = "macOS";
    } else if (ua.includes("Android")) {
      os = "Android";
    } else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) {
      os = "iOS";
    } else if (ua.includes("Linux")) {
      os = "Linux";
    }

    if (
      ua.includes("tablet") ||
      ua.includes("iPad") ||
      ua.includes("PlayBook") ||
      ua.includes("Silk") ||
      (ua.includes("Android") && !ua.includes("Mobile"))
    ) {
      device = "Tablet";
    } else if (
      ua.includes("Mobile") ||
      ua.includes("iPhone") ||
      ua.includes("iPod") ||
      ua.includes("BlackBerry") ||
      ua.includes("Windows Phone") ||
      ua.includes("Opera Mini")
    ) {
      device = "Mobile";
    }
  }

  return { browser, os, device };
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_VISITOR_TRACKING !== "true") {
    return NextResponse.json({ success: false, reason: "disabled" }, { status: 403 });
  }

  try {
    const geo = geolocation(request);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const ua = request.headers.get("user-agent") || "";

    const ipHash = hashIP(ip);
    const { browser, os, device } = parseUserAgent(ua);
    const now = new Date().toISOString();

    await trackVisitor({
      id: crypto.randomUUID(),
      ipHash,
      city: geo?.city || "Unknown",
      region: geo?.region || "Unknown",
      country: geo?.country || "Unknown",
      latitude: geo?.latitude || "Unknown",
      longitude: geo?.longitude || "Unknown",
      browser,
      os,
      device,
      visitedAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visitor tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
