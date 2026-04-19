/**
 * PUT /api/requests/[id]/complete
 * ================================
 * Mark a request as resolved and update trust scores.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";
import { calculateTrustScoreChange, calculateBadges } from "@/lib/ai";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { helperId } = await request.json();

    await connectDB();

    const helpRequest = await Request.findById(id);
    if (!helpRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (helpRequest.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Mark request as resolved
    helpRequest.status = "resolved";

    // Mark the specific helper as completed
    const helperEntry = helpRequest.helpers.find(
      (h: { user: { toString: () => string } }) => h.user.toString() === helperId
    );
    if (helperEntry) {
      helperEntry.status = "completed";
    }

    await helpRequest.save();

    // Update helper's trust score and stats
    const helper = await User.findById(helperId);
    if (helper) {
      helper.trustScore = calculateTrustScoreChange(helper.trustScore, true);
      helper.helpGiven += 1;
      helper.badges = calculateBadges(helper.helpGiven, helper.trustScore);
      await helper.save();

      // Notify helper
      await Notification.create({
        user: helperId,
        type: "request_resolved",
        title: "Request resolved! 🎉",
        message: `Your help on "${helpRequest.title}" was marked as successful. Trust score updated!`,
        link: `/dashboard/requests/${id}`,
      });
    }

    // Update requester's stats
    const author = await User.findById(session.userId);
    if (author) {
      author.helpReceived += 1;
      await author.save();
    }

    const updatedRequest = await Request.findById(id)
      .populate("author", "name email role skills trustScore badges location bio createdAt")
      .populate("suggestedHelpers", "name skills trustScore badges role location")
      .populate("helpers.user", "name skills trustScore badges role location")
      .lean();

    return NextResponse.json({ 
      message: "Request resolved successfully",
      request: updatedRequest 
    });
  } catch (error) {
    console.error("Complete request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
