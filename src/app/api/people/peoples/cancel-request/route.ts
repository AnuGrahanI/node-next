import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/utils/auth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // 🔐 Authenticate the requesting user
    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    const { userId } = auth;

    // 🎯 Get recipient ID from request body
    const { recipientId } = await req.json();
    if (!recipientId) {
      return NextResponse.json(
        { success: false, message: "Recipient ID is required" },
        { status: 400 }
      );
    }

    const rid = new mongoose.Types.ObjectId(recipientId);

    // 👥 Check both users exist
    const [sender, recipient] = await Promise.all([
      User.findById(userId).lean(),
      User.findById(rid).lean(),
    ]);

    if (!sender || !recipient) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ❗ Check if there's a pending friend request
    const hasPendingRequest = sender.sentFriendRequests?.some(
      (id) => id.toString() === recipientId
    );

    if (!hasPendingRequest) {
      return NextResponse.json(
        { success: false, message: "No pending friend request to cancel" },
        { status: 400 }
      );
    }

    // 🗑 Pull the friend request from both users
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { sentFriendRequests: rid },
      }),
      User.findByIdAndUpdate(recipientId, {
        $pull: { receivedFriendRequests: userId },
      }),
    ]);

    return NextResponse.json(
      { success: true, message: "Friend request cancelled" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to cancel friend request",
      },
      { status: 500 }
    );
  }
}
