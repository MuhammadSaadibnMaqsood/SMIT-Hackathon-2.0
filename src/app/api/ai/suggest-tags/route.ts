/**
 * POST /api/ai/suggest-tags
 * ==========================
 * Returns AI-suggested tags from description text.
 */
import { NextRequest, NextResponse } from "next/server";
import { suggestTags } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });
    const tags = suggestTags(text);
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Suggest tags error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
