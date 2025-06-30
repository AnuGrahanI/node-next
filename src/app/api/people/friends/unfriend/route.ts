import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
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

    const { friendId } = await req.json();
    if (!friendId) {
      return NextResponse.json(
        { success: false, message: 'Friend ID is required' },
        { status: 400 }
      );
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { friends: friendId }
      }),
      User.findByIdAndUpdate(friendId, {
        $pull: { friends: userId }
      })
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Unfriended successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to unfriend'
      },
      { status: 500 }
    );
  }
}