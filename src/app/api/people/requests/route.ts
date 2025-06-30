import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
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

    const user = await User.findById(userId)
      .populate('receivedFriendRequests', 'name email image')
      .select('receivedFriendRequests');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user.receivedFriendRequests || []
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch friend requests'
      },
      { status: 500 }
    );
  }
}