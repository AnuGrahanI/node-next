// import { connectDB } from '@/lib/mongodb';
// import Message from '@/models/Message';
// import { NextRequest, NextResponse } from 'next/server';
// import { authenticateRequest } from '@/lib/utils/auth';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
    
//     const auth = authenticateRequest(req);
//                     if (auth.error) {
//                       return NextResponse.json(
//                         { success: false, message: auth.error },
//                         { status: 401 }
//                       );
//                     }
//                     const { userId } = auth;
//             const currentUserId = userId;
//     const otherUserId = params.id;

//     const messages = await Message.find({
//       $or: [
//         { sender: currentUserId, receiver: otherUserId },
//         { sender: otherUserId, receiver: currentUserId }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .lean();

//     return NextResponse.json(
//       {
//         success: true,
//         messages: messages.map(msg => ({
//           ...msg,
//           _id: msg._id.toString(),
//           sender: msg.sender.toString(),
//           receiver: msg.receiver.toString()
//         }))
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || 'Failed to fetch messages'
//       },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
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

    // Extract dynamic `id` param manually
    const url = new URL(req.url);
    const otherUserId = url.pathname.split('/').pop(); // get last part of path

    if (!otherUserId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        messages: messages.map((msg) => ({
          ...msg,
          _id: msg._id.toString(),
          sender: msg.sender.toString(),
          receiver: msg.receiver.toString(),
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}