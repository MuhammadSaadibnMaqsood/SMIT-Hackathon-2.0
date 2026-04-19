/**
 * GET/POST /api/messages
 * =======================
 * GET: List conversations. POST: Send a message.
 * POST also broadcasts via Supabase Realtime so both
 * sender and receiver get instant updates.
 */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message, { getConversationId } from "@/models/Message";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    await connectDB();

    const messages = await Message.find({
      $or: [{ sender: session.userId }, { receiver: session.userId }],
    }).sort({ createdAt: -1 }).lean();

    const convMap = new Map<string, { conversationId: string; lastMessage: (typeof messages)[0]; unreadCount: number; otherUserId: string }>();

    for (const msg of messages) {
      if (!convMap.has(msg.conversationId)) {
        const otherUserId = msg.sender.toString() === session.userId ? msg.receiver.toString() : msg.sender.toString();
        convMap.set(msg.conversationId, { conversationId: msg.conversationId, lastMessage: msg, unreadCount: 0, otherUserId });
      }
      if (msg.receiver.toString() === session.userId && !msg.read) {
        convMap.get(msg.conversationId)!.unreadCount++;
      }
    }

    const otherUserIds = Array.from(convMap.values()).map((c) => c.otherUserId);
    const otherUsers = await User.find({ _id: { $in: otherUserIds } }).select("name role trustScore").lean();
    const userMap = new Map(otherUsers.map((u) => [u._id.toString(), u]));

    const conversations = Array.from(convMap.values()).map((conv) => ({
      ...conv,
      otherUser: userMap.get(conv.otherUserId) || null,
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { receiverId, content, requestRef } = await request.json();
    if (!receiverId || !content) return NextResponse.json({ error: "Receiver and content are required" }, { status: 400 });

    await connectDB();
    const conversationId = getConversationId(session.userId, receiverId);

    const message = await Message.create({
      conversationId, sender: session.userId, receiver: receiverId, content, requestRef: requestRef || undefined,
    });

    await Notification.create({
      user: receiverId, type: "message", title: "New message",
      message: `${session.name}: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
      link: `/dashboard/messages?conversation=${conversationId}`,
    });

    // Broadcast real-time event to both users via Supabase
    try {
      const supabase = createServerSupabase();
      if (supabase) {
        const payload = {
          type: "broadcast" as const,
          event: "new_message",
          payload: {
            conversationId,
            senderId: session.userId,
            senderName: session.name,
            receiverId,
            content: content.substring(0, 100),
            createdAt: message.createdAt,
          },
        };
        // Broadcast to receiver's personal channel
        const receiverChannel = supabase.channel(`user:${receiverId}`);
        await receiverChannel.send(payload);
        supabase.removeChannel(receiverChannel);

        // Broadcast to sender's personal channel (for multi-tab sync)
        const senderChannel = supabase.channel(`user:${session.userId}`);
        await senderChannel.send(payload);
        supabase.removeChannel(senderChannel);
      }
    } catch (e) {
      // Realtime broadcast is best-effort, don't fail the request
      console.warn("Supabase broadcast error (non-fatal):", e);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
