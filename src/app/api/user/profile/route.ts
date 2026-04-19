/**
 * GET/PUT /api/user/profile
 * =========================
 * Get or update the authenticated user's profile.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";
import { calculateBadges } from "@/lib/ai";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ["name", "bio", "location", "skills", "interests", "role"];
    const sanitized: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitized[field] = updates[field];
      }
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      sanitized,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Recalculate badges
    const newBadges = calculateBadges(user.helpGiven, user.trustScore);
    if (JSON.stringify(newBadges) !== JSON.stringify(user.badges)) {
      user.badges = newBadges;
      await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
