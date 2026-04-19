/**
 * POST /api/auth/signup
 * =====================
 * Creates a new user account with role selection.
 * Expects JSON body: { name, email, password, role }
 * Returns JWT token as httpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const { name, email, password, role } = await request.json();

    // 2. Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["need_help", "can_help", "both"];
    const userRole = validRoles.includes(role) ? role : "both";

    // 3. Connect to database
    await connectDB();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // 5. Create new user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password, role: userRole });

    // 6. Generate JWT and set cookie
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    // 7. Return success (never expose the password)
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboardingComplete: user.onboardingComplete,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);

    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
