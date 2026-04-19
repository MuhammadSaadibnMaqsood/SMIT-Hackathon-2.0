/**
 * MongoDB Database Connection
 * ===========================
 * Singleton connection using Mongoose.
 * Caches the connection in development to prevent
 * multiple connections during hot-reloads.
 */

import mongoose from "mongoose";

// Extend the global type to cache the mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️  Please define the MONGODB_URI environment variable in .env.local"
  );
}

/**
 * Global cache to reuse the connection across hot-reloads in dev.
 * In production, this is only called once.
 */
let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

/**
 * Connect to MongoDB and return the cached connection.
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering for faster error detection
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset on failure so next call retries
    throw e;
  }

  return cached.conn;
}

export default connectDB;
