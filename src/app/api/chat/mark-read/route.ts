// app/api/chat/mark-read/route.ts
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
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
            const currentUserId = userId;
    const { senderId } = await req.json();

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Messages marked as read'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark messages as read'
      },
      { status: 500 }
    );
  }
}