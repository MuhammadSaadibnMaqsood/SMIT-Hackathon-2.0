/**
 * POST /api/auth/logout
 * =====================
 * Clears the auth cookie to log the user out.
 */

import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await removeAuthCookie();
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
