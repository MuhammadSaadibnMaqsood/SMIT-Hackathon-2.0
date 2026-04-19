/**
 * GET/PUT /api/requests/[id]
 * ==========================
 * GET: Get a single request with full details.
 * PUT: Update request status.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const helpRequest = await Request.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name email role skills trustScore badges location bio createdAt")
      .populate("suggestedHelpers", "name skills trustScore badges role location")
      .populate("helpers.user", "name skills trustScore badges role location")
      .lean();

    if (!helpRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ request: helpRequest });
  } catch (error) {
    console.error("Get request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const { status } = await request.json();

    await connectDB();

    const helpRequest = await Request.findById(id);
    if (!helpRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (helpRequest.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    helpRequest.status = status;
    await helpRequest.save();

    const updatedRequest = await Request.findById(id)
      .populate("author", "name email role skills trustScore badges location bio createdAt")
      .populate("suggestedHelpers", "name skills trustScore badges role location")
      .populate("helpers.user", "name skills trustScore badges role location")
      .lean();

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
