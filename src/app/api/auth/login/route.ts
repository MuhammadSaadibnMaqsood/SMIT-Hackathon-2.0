/**
 * POST /api/auth/login
 * ====================
 * Authenticates an existing user.
 * Expects JSON body: { email, password }
 * Returns JWT token as httpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const { email, password } = await request.json();

    // 2. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 3. Connect to database
    await connectDB();

    // 4. Find user and explicitly select the password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 6. Generate JWT and set cookie
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    // 7. Return success
    return NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboardingComplete: user.onboardingComplete,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
