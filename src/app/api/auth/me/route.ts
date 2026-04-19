/**
 * GET /api/auth/me
 * ================
 * Returns the full profile of the currently authenticated user.
 */

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        interests: user.interests,
        location: user.location,
        bio: user.bio,
        trustScore: user.trustScore,
        badges: user.badges,
        helpGiven: user.helpGiven,
        helpReceived: user.helpReceived,
        onboardingComplete: user.onboardingComplete,
        createdAt: user.createdAt,
        isAdmin: isAdminUser(user.email),
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
