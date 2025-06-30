import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  try {
    await connectDB();
    
    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }
    const { userId } = auth;

    const { requestorId } = await req.json();
    if (!requestorId) {
      return NextResponse.json(
        { success: false, message: 'Requestor ID is required' },
        { status: 400 }
      );
    }

    const [currentUser, requestor] = await Promise.all([
      User.findById(userId),
      User.findById(requestorId)
    ]);

    if (!currentUser || !requestor) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!currentUser.receivedFriendRequests?.includes(requestorId)) {
      return NextResponse.json(
        { success: false, message: 'No pending request from this user' },
        { status: 400 }
      );
    }

    if (params.action === 'accept') {
      // Add each other as friends
      await Promise.all([
        User.findByIdAndUpdate(userId, {
          $pull: { receivedFriendRequests: requestorId },
          $addToSet: { friends: requestorId }
        }),
        User.findByIdAndUpdate(requestorId, {
          $pull: { sentFriendRequests: userId },
          $addToSet: { friends: userId }
        })
      ]);
    } else {
      // Just remove the request
      await Promise.all([
        User.findByIdAndUpdate(userId, {
          $pull: { receivedFriendRequests: requestorId }
        }),
        User.findByIdAndUpdate(requestorId, {
          $pull: { sentFriendRequests: userId }
        })
      ]);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Request ${params.action === 'accept' ? 'accepted' : 'rejected'} successfully`
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || `Failed to ${params.action} friend request`
      },
      { status: 500 }
    );
  }
}