/**
 * GET /api/ai/trends
 * ===================
 * Community trends and insights.
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Category distribution
    const categoryStats = await Request.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Urgency distribution
    const urgencyStats = await Request.aggregate([
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top tags
    const tagStats = await Request.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    // Resolution rate
    const totalRequests = await Request.countDocuments();
    const resolvedRequests = await Request.countDocuments({ status: "resolved" });
    const resolutionRate = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

    // Weekly activity
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRequests = await Request.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Active helpers
    const activeHelpers = await User.countDocuments({ role: { $in: ["can_help", "both"] }, onboardingComplete: true });

    // Skills in demand
    const skillDemand = await Request.aggregate([
      { $match: { status: "open" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      categoryStats,
      urgencyStats,
      tagStats,
      resolutionRate,
      weeklyRequests,
      activeHelpers,
      totalRequests,
      resolvedRequests,
      skillDemand,
    });
  } catch (error) {
    console.error("Trends error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
