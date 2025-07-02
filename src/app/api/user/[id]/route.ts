// // app/api/users/[id]/route.ts
// import { connectDB } from '@/lib/mongodb';
// import User from '@/models/User';
// import { NextRequest, NextResponse } from 'next/server';
// import { authenticateRequest } from '@/lib/utils/auth';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;

//   try {
//     await connectDB();

//     const auth = authenticateRequest(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, message: auth.error },
//         { status: 401 }
//       );
//     }

//     const requesterId = auth.userId;
//     const userId = id;

//     // Fetch both requester and target user
//     const [targetUser, requester] = await Promise.all([
//       User.findById(userId)
//         .select('-password -email -createdAt -updatedAt -__v')
//         .lean(),
//       User.findById(requesterId).select('friends').lean()
//     ]);

//     if (!targetUser) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const isMe = requesterId === targetUser._id.toString();
//     const isFriend = requester?.friends?.some(
//       (friendId: any) => friendId.toString() === targetUser._id.toString()
//     ) ?? false;

//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           ...targetUser,
//           _id: targetUser._id.toString(),
//           isMe,
//           isFriend,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || 'Failed to fetch user',
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/users/[id]/route.ts
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    const requesterId = auth.userId;
    const userId = id;

    const [targetUser, requester] = await Promise.all([
      User.findById(userId)
        .select('-password -email -createdAt -updatedAt -__v')
        .lean(),
      User.findById(requesterId)
        .select('friends sentFriendRequests receivedFriendRequests')
        .lean()
    ]);

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const isMe = requesterId === targetUser._id.toString();

    let relationshipStatus: 'following' | 'sentRequest' | 'acceptRequest' | 'follow' = 'follow';

    const targetIdStr = targetUser._id.toString();

    if (requester?.friends?.some(id => id.toString() === targetIdStr)) {
      relationshipStatus = 'following';
    } else if (requester?.sentFriendRequests?.some(id => id.toString() === targetIdStr)) {
      relationshipStatus = 'sentRequest';
    } else if (requester?.receivedFriendRequests?.some(id => id.toString() === targetIdStr)) {
      relationshipStatus = 'acceptRequest';
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...targetUser,
          _id: targetIdStr,
          isMe,
          relationshipStatus,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}
