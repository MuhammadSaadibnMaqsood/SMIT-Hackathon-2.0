/**
 * User Model
 * ==========
 * Mongoose schema for the User collection.
 * Extended for Helplytics AI with role, skills, trust scoring, and badges.
 * Passwords are hashed automatically before saving.
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

/** TypeScript interface for User documents */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "need_help" | "can_help" | "both";
  skills: string[];
  interests: string[];
  location: string;
  bio: string;
  trustScore: number;
  badges: string[];
  helpGiven: number;
  helpReceived: number;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["need_help", "can_help", "both"],
      default: "both",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio must be less than 500 characters"],
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    badges: {
      type: [String],
      default: [],
    },
    helpGiven: {
      type: Number,
      default: 0,
    },
    helpReceived: {
      type: Number,
      default: 0,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/**
 * Pre-save hook: hash the password before storing.
 * Only runs when the password field is modified.
 * Note: Mongoose 8+ async pre hooks don't require next().
 */
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method: compare a candidate password with the hashed one.
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development (HMR)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
