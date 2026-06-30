import { NextRequest, NextResponse } from "next/server";
import { getDiscussions, addDiscussion } from "@/lib/discussions";

export async function GET() {
  try {
    const discussions = await getDiscussions();
    return NextResponse.json({ discussions });
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = (body.name || "").trim();
    const message = (body.message || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    const sanitizedName = escapeHtml(name);
    const sanitizedMessage = escapeHtml(message);

    const discussion = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
    };

    await addDiscussion(discussion);

    return NextResponse.json(
      { message: "Discussion added successfully", discussion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add discussion:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add discussion" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
