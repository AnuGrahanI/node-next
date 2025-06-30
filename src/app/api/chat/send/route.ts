// app/api/chat/send/route.ts
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
    const { receiverId, content } = await req.json();
    

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      sender: currentUserId,
      receiver: receiverId,
      content,
      read: false
    });

    await newMessage.save();

    return NextResponse.json(
      {
        success: true,
        message: {
          ...newMessage.toObject(),
          _id: newMessage._id.toString(),
          sender: newMessage.sender.toString(),
          receiver: newMessage.receiver.toString()
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send message'
      },
      { status: 500 }
    );
  }
}