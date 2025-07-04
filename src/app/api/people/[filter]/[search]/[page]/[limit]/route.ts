// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import User from '@/models/User';
// import { authenticateRequest } from '@/lib/utils/auth';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { filter: string; search: string; page: string; limit: string } }
// ) {
//   try {
//     await connectDB();

//     const auth = authenticateRequest(req);
//     if (auth.error || !auth.userId)
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

//     const me = await User.findById(auth.userId)
//       .populate('friends', '_id')
//       .populate('sentFriendRequests', '_id')
//       .populate('receivedFriendRequests', '_id')
//       .lean();

//     if (!me)
//       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

//     const friendIds   = new Set(me.friends?.map((u: any) => String(u._id)));
//     const sentIds     = new Set(me.sentFriendRequests?.map((u: any) => String(u._id)));
//     const receivedIds = new Set(me.receivedFriendRequests?.map((u: any) => String(u._id)));

//     const searchTerm = params.search === 'null' ? '' : decodeURIComponent(params.search);
//     const regex = new RegExp(searchTerm, 'i');
//     const filterBy = params.filter;

//     const page = parseInt(params.page || '1');
//     const limit = parseInt(params.limit || '12');

//     const query: any = { _id: { $ne: me._id } };
//     if (searchTerm) query.$or = [{ name: regex }, { username: regex }];

//     const total = await User.countDocuments(query);

//     const users = await User.find(query)
//       .select('username name fname lname image')
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     const rows = users
//       .map(u => ({
//         id: u._id,
//         username: u.username,
//         name: u.name || `${u.fname ?? ''} ${u.lname ?? ''}`.trim(),
//         image: u.image,
//         isFriend: friendIds.has(String(u._id)),
//         isFollowing: sentIds.has(String(u._id)),
//         hasSentMeRequest: receivedIds.has(String(u._id))
//       }))
//       .filter(u => {
//         if (filterBy === 'friends') return u.isFriend;
//         if (filterBy === 'sent') return u.isFollowing && !u.isFriend;
//         if (filterBy === 'received') return u.hasSentMeRequest;
//         return true;
//       });

//     return NextResponse.json({
//       success: true,
//       data: rows,
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filter: string; search: string; page: string; limit: string }> }
) {
  const { filter, search, page: rawPage, limit: rawLimit } = await params;

  const page = parseInt(rawPage || '1');
  const limit = parseInt(rawLimit || '12');

  try {
    await connectDB();

    const auth = authenticateRequest(req);
    if (auth.error || !auth.userId)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const me = await User.findById(auth.userId)
      .populate('friends', '_id')
      .populate('sentFriendRequests', '_id')
      .populate('receivedFriendRequests', '_id')
      .lean();

    if (!me)
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const friendIds = new Set(me.friends?.map((u: any) => String(u._id)));
    const sentIds = new Set(me.sentFriendRequests?.map((u: any) => String(u._id)));
    const receivedIds = new Set(me.receivedFriendRequests?.map((u: any) => String(u._id)));

    const searchTerm = search === 'null' ? '' : decodeURIComponent(search);
    const regex = new RegExp(searchTerm, 'i');
    const filterBy = filter;

    const query: any = { _id: { $ne: me._id } };
    if (searchTerm) query.$or = [{ name: regex }, { username: regex }];

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('username name fname lname image')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const rows = users
      .map(u => ({
        id: u._id,
        username: u.username,
        name: u.name || `${u.fname ?? ''} ${u.lname ?? ''}`.trim(),
        image: u.image,
        isFriend: friendIds.has(String(u._id)),
        isFollowing: sentIds.has(String(u._id)),
        hasSentMeRequest: receivedIds.has(String(u._id))
      }))
      .filter(u => {
        if (filterBy === 'friends') return u.isFriend;
        if (filterBy === 'sent') return u.isFollowing && !u.isFriend;
        if (filterBy === 'received') return u.hasSentMeRequest;
        return true;
      });

    return NextResponse.json({
      success: true,
      data: rows,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}