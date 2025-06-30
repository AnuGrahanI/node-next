import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get user ID from token
    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        { status: 401 }
      );
    }
    const { userId } = auth;

    // Find the current user to get their friends and friend requests
    const currentUser = await User.findById(userId)
      .select('friends sentFriendRequests receivedFriendRequests');
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize arrays if they don't exist
    const friends = currentUser.friends || [];
    const sentRequests = currentUser.sentFriendRequests || [];
    const receivedRequests = currentUser.receivedFriendRequests || [];

    // Get all IDs to exclude (friends + sent/received requests + self)
    const excludedUserIds = [
      ...friends,
      ...sentRequests,
      ...receivedRequests,
      userId
    ].map(id => id.toString()); // Ensure all IDs are strings for comparison

    // Find users who are not in the excluded list
    const users = await User.find({
      _id: { $nin: excludedUserIds }
    }).select('name email image');

    return NextResponse.json(
      {
        success: true,
        message: 'Potential friends fetched successfully',
        data: users
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch potential friends',
      },
      { status: 500 }
    );
  }
}