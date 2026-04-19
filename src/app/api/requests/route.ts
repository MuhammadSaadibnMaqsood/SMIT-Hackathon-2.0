/**
 * POST/GET /api/requests
 * ======================
 * POST: Create a new help request with AI processing.
 * GET: List requests with filters.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSessionUser } from "@/lib/auth";
import {
  suggestTags,
  detectUrgency,
  autoCategorizе,
  generateSummary,
  calculateHelperScore,
} from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, description, tags, urgency, category, location } =
      await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // AI Processing
    const aiTags = tags?.length > 0 ? tags : suggestTags(`${title} ${description}`);
    const aiUrgency = urgency || detectUrgency(`${title} ${description}`);
    const aiCategory = category || autoCategorizе(title, description);
    const aiSummary = generateSummary(description);

    // Find potential helpers
    const potentialHelpers = await User.find({
      _id: { $ne: session.userId },
      role: { $in: ["can_help", "both"] },
      onboardingComplete: true,
    })
      .select("skills trustScore")
      .lean();

    const scoredHelpers = potentialHelpers
      .map((helper) => ({
        id: helper._id,
        score: calculateHelperScore(
          helper.skills,
          aiTags,
          aiCategory,
          helper.trustScore
        ),
      }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Create request
    const newRequest = await Request.create({
      title,
      description,
      author: session.userId,
      category: aiCategory,
      tags: aiTags,
      urgency: aiUrgency,
      aiSummary,
      suggestedHelpers: scoredHelpers.map((h) => h.id),
      location: location || "",
    });

    // Send notifications to suggested helpers
    for (const helper of scoredHelpers) {
      await Notification.create({
        user: helper.id,
        type: "new_request",
        title: "New request matches your skills",
        message: `"${title}" - Someone needs your help!`,
        link: `/dashboard/requests/${newRequest._id}`,
      });
    }

    return NextResponse.json(
      { message: "Request created", request: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const status = searchParams.get("status") || "open";
    const skill = searchParams.get("skill");
    const location = searchParams.get("location");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const authorId = searchParams.get("author");

    await connectDB();

    // Build query
    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    if (urgency && urgency !== "all") query.urgency = urgency;
    if (status && status !== "all") query.status = status;
    if (skill) query.tags = { $in: [skill] };
    if (location) query.location = { $regex: location, $options: "i" };
    if (authorId) query.author = authorId;

    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate("author", "name trustScore role location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
