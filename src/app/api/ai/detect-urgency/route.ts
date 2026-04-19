/**
 * POST /api/ai/detect-urgency
 * ============================
 * Returns urgency level detected from text.
 */
import { NextRequest, NextResponse } from "next/server";
import { detectUrgency } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });
    const urgency = detectUrgency(text);
    return NextResponse.json({ urgency });
  } catch (error) {
    console.error("Detect urgency error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
