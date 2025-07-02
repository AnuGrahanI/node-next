
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/utils/auth";
import Post from "@/models/Post";

// type Params = {
//   params: Promise<{ id: string }>;
// };
export const runtime = "nodejs"; // ensure access to Node.js APIs
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await the params
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

  const post = await Post.findById(id); // now safe to use
  if (!post) {
    return NextResponse.json(
      { success: false, message: "Post not found" },
      { status: 404 }
    );
  }

  const index = post.likes.findIndex((likedId) => likedId.equals(userObjectId));

  if (index >= 0) {
    post.likes.splice(index, 1); // Remove like
  } else {
    post.likes.push(userObjectId); // Add like
  }

  await post.save();

  return NextResponse.json({
    success: true,
    liked: index === -1,
    likesCount: post.likes.length,
  });
}