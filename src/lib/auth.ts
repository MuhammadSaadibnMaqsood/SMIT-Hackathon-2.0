/**
 * Authentication Utilities
 * ========================
 * JWT token generation, verification, and cookie helpers.
 */

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const TOKEN_NAME = "auth-token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/** Payload shape stored inside every JWT */
export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

/**
 * Sign a JWT with the given payload.
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT. Returns null if invalid.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}

/**
 * Set the auth cookie after login/signup.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Remove the auth cookie (logout).
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Read the auth cookie and return the decoded user payload.
 * Returns null if no valid token is found.
 */
export async function getSessionUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}
