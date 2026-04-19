/**
 * GET /api/user/[id]
 * ==================
 * Get a user's public profile by their ID.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const user = await User.findById(id).select(
      "name role skills interests location bio trustScore badges helpGiven helpReceived createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
