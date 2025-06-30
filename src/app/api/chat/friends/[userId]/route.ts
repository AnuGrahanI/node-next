// app/api/chat/messages/[userId]/route.ts
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
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
    const currentUserId = userId;
    const otherUserId = params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .lean();

    return NextResponse.json(
      {
        success: true,
        messages: messages.map(msg => ({
          ...msg,
          _id: msg._id.toString(),
          sender: msg.sender.toString(),
          receiver: msg.receiver.toString()
        }))
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch messages'
      },
      { status: 500 }
    );
  }
}