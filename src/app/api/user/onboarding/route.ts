/**
 * PUT /api/user/onboarding
 * ========================
 * Saves onboarding data for the authenticated user.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, bio, location, skills, interests } = await request.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(skills && { skills }),
        ...(interests && { interests }),
        onboardingComplete: true,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Onboarding completed successfully",
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
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
