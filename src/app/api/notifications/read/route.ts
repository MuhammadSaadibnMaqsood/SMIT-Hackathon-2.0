/**
 * PUT /api/notifications/read — Mark all notifications as read.
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";

export async function PUT() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    await Notification.updateMany({ user: session.userId, read: false }, { read: true });
    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
