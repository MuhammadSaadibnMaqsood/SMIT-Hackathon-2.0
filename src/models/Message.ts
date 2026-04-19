/**
 * Message Model
 * =============
 * Mongoose schema for direct messages between users.
 * Messages are grouped by conversationId for efficient retrieval.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversationId: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  requestRef?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [2000, "Message must be less than 2000 characters"],
    },
    requestRef: {
      type: Schema.Types.ObjectId,
      ref: "Request",
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

// Index for efficient conversation retrieval
MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ receiver: 1, read: 1 });

/**
 * Static helper: generate a deterministic conversation ID
 * from two user IDs (always sorted for consistency).
 */
export function getConversationId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("_");
}

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
