/**
 * Request Model
 * =============
 * Mongoose schema for community help requests.
 * Includes AI-generated fields: tags, urgency, category, summary, and matched helpers.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHelper {
  user: mongoose.Types.ObjectId;
  status: "offered" | "accepted" | "completed";
  offeredAt: Date;
}

export interface IRequest extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  category: "technical" | "career" | "academic" | "creative" | "life" | "other";
  tags: string[];
  urgency: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  aiSummary: string;
  suggestedHelpers: mongoose.Types.ObjectId[];
  helpers: IHelper[];
  location: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title must be less than 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [5000, "Description must be less than 5000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "career", "academic", "creative", "life", "other"],
      default: "other",
    },
    tags: {
      type: [String],
      default: [],
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    aiSummary: {
      type: String,
      default: "",
    },
    suggestedHelpers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    helpers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["offered", "accepted", "completed"],
          default: "offered",
        },
        offeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      type: String,
      default: "",
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
RequestSchema.index({ category: 1, urgency: 1, status: 1 });
RequestSchema.index({ tags: 1 });
RequestSchema.index({ author: 1 });
RequestSchema.index({ createdAt: -1 });

const Request: Model<IRequest> =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
