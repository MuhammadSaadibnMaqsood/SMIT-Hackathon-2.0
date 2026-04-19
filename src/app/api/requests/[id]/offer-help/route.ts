/**
 * POST /api/requests/[id]/offer-help
 * ===================================
 * Offer help on a request.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const helpRequest = await Request.findById(id);
    if (!helpRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (helpRequest.author.toString() === session.userId) {
      return NextResponse.json(
        { error: "You cannot offer help on your own request" },
        { status: 400 }
      );
    }

    // Check if already offered
    const alreadyOffered = helpRequest.helpers.some(
      (h: { user: { toString: () => string } }) => h.user.toString() === session.userId
    );

    if (alreadyOffered) {
      return NextResponse.json(
        { error: "You have already offered help" },
        { status: 400 }
      );
    }

    helpRequest.helpers.push({
      user: session.userId as any,
      status: "offered",
      offeredAt: new Date(),
    });

    if (helpRequest.status === "open") {
      helpRequest.status = "in_progress";
    }

    await helpRequest.save();

    // Notify the request author
    await Notification.create({
      user: helpRequest.author,
      type: "help_offered",
      title: "Someone offered to help!",
      message: `A community member offered help on "${helpRequest.title}"`,
      link: `/dashboard/requests/${id}`,
    });

    return NextResponse.json({ message: "Help offered successfully" });
  } catch (error) {
    console.error("Offer help error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
