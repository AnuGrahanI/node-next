
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/Message';
import { authenticateRequest } from '@/lib/utils/auth';

interface Friend {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface FriendWithMessages extends Friend {
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

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
      .populate<{ friends: Friend[] }>({
        path: 'friends',
        select: 'name email image'
      })
      .select('friends')
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Type guard to ensure friends exists
    if (!user.friends) {
      return NextResponse.json(
        {
          success: true,
          data: []
        },
        { status: 200 }
      );
    }

    // Get last messages and unread counts
    const friendsWithMessages = await Promise.all(
      user.friends.map(async (friend) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: friend._id },
            { sender: friend._id, receiver: userId }
          ]
        })
        .sort({ createdAt: -1 })
        .select('content createdAt')
        .lean();

        const unreadCount = await Message.countDocuments({
          sender: friend._id,
          receiver: userId,
          read: false
        });

        return {
          _id: friend._id.toString(),
          name: friend.name,
          image: friend.image,
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.createdAt,
          unreadCount
        } as FriendWithMessages;
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: friendsWithMessages
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch friends list'
      },
      { status: 500 }
    );
  }
}