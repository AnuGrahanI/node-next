import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Authenticate the requesting user
    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }
    const { userId } = auth;

    // Get the recipient ID from request body
    const { recipientId } = await req.json();
    
    if (!recipientId) {
      return NextResponse.json(
        { success: false, message: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    // Check if users exist
    const [sender, recipient] = await Promise.all([
      User.findById(userId),
      User.findById(recipientId)
    ]);

    if (!sender || !recipient) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already friends
    if (sender.friends?.includes(recipientId)) {
      return NextResponse.json(
        { success: false, message: 'Already friends with this user' },
        { status: 400 }
      );
    }

    // Check if request already exists
    if (sender?.sentFriendRequests?.includes(recipientId)) {
      return NextResponse.json(
        { success: false, message: 'Friend request already sent' },
        { status: 400 }
      );
    }

    // Update both users
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $addToSet: { sentFriendRequests: recipientId }
      }),
      User.findByIdAndUpdate(recipientId, {
        $addToSet: { receivedFriendRequests: userId }
      })
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Friend request sent successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send friend request'
      },
      { status: 500 }
    );
  }
}