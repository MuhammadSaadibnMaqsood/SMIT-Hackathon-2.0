/**
 * GET /api/user/leaderboard
 * =========================
 * Returns top helpers sorted by trust score and help given.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const leaders = await User.find({
      helpGiven: { $gte: 0 },
      onboardingComplete: true,
    })
      .select("name role skills trustScore badges helpGiven helpReceived location createdAt")
      .sort({ trustScore: -1, helpGiven: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ leaders });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
