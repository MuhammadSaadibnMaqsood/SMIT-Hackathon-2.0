/**
 * Notification Model
 * ==================
 * Mongoose schema for user notifications.
 * Tracks request updates, help offers, badge awards, and trust changes.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: "new_request" | "help_offered" | "help_accepted" | "message" | "badge_earned" | "trust_update" | "request_resolved";
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "new_request",
        "help_offered",
        "help_accepted",
        "message",
        "badge_earned",
        "trust_update",
        "request_resolved",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    link: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient retrieval of unread notifications
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
