/**
 * GET /api/admin/overview — Analytics + recent requests for the admin panel.
 */
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!isAdminUser(session.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const [totalRequests, resolvedRequests, totalUsers, recentRequests] =
      await Promise.all([
        Request.countDocuments(),
        Request.countDocuments({ status: "resolved" }),
        User.countDocuments(),
        Request.find()
          .sort({ createdAt: -1 })
          .limit(40)
          .populate("author", "name email")
          .lean(),
      ]);

    const openRequests = await Request.countDocuments({
      status: { $in: ["open", "in_progress"] },
    });

    const categoryStats = await Request.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      stats: {
        totalRequests,
        resolvedRequests,
        openRequests,
        totalUsers,
        resolutionRate:
          totalRequests > 0
            ? Math.round((resolvedRequests / totalRequests) * 100)
            : 0,
      },
      categoryStats,
      requests: recentRequests,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
