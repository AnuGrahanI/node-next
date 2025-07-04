import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/utils/auth";
import Post from "@/models/Post";
import User from "@/models/User"; // Assuming you have a User model

export const runtime = "nodejs";

// POST /api/posts/:id/comments - Add a new comment
// POST /api/posts/:id/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { text } = body;

  if (!text) {
    return NextResponse.json(
      { success: false, message: "Text is required" },
      { status: 400 }
    );
  }

  await connectDB();

  const auth = authenticateRequest(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: 401 }
    );
  }

  const { userId } = auth;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json(
      { success: false, message: "Post not found" },
      { status: 404 }
    );
  }

  const user = await User.findById(userId).select("name image");
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  // Add comment
  const newComment = {
    _id: new mongoose.Types.ObjectId(),
    user: userObjectId,
    text,
    createdAt: new Date(),
  };

  post.comments.unshift(newComment);
  await post.save();

  return NextResponse.json({
    success: true,
    comment: {
      ...newComment,
      user: {
        _id: userId,
        name: user.name,
        image: user.image,
      },
    },
  });
}
// GET /api/posts/:id/comments
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const post = await Post.findById(id).populate<{
    comments: Array<{
      user: { _id: string; name: string; image: string };
    } & {
      _id: mongoose.Types.ObjectId;
      text: string;
      createdAt: Date;
    }>;
  }>("comments.user", "_id name image");

  if (!post) {
    return NextResponse.json(
      { success: false, message: "Post not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    comments: post.comments.map((c) => ({
      _id: c._id,
      text: c.text,
      createdAt: c.createdAt,
      user: c.user,
    })),
  });
}