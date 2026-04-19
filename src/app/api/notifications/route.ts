/**
 * GET /api/notifications
 * PUT /api/notifications (mark all as read handled by /read sub-route)
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const notifications = await Notification.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
