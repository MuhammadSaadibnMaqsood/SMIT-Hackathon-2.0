/**
 * PATCH /api/user/update-email
 * ===========================
 * Updates the authenticated user's email.
 * Expects JSON body: { email }
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const { email } = await request.json();

    // 3. Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    // 4. Connect to database
    await connectDB();

    // 5. Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== session.userId) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }

    // 6. Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { email: email.toLowerCase() },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 7. Return success
    return NextResponse.json(
      {
        message: "Email updated successfully. Please log in again if your session expires.",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
