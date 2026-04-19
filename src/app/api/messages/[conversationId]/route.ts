/**
 * GET /api/messages/[conversationId]
 * ===================================
 * Get all messages in a conversation + mark as read.
 */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { conversationId } = await params;
    await connectDB();

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: session.userId, read: false },
      { read: true }
    );

    const messages = await Message.find({ conversationId })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Conversation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
