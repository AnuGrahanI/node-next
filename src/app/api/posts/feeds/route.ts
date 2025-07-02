// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { authenticateRequest } from "@/lib/utils/auth";
// import User from "@/models/User";
// import Post from "@/models/Post";

// export const runtime = "nodejs";          // fast for read‑only queries

// export async function GET(req: NextRequest) {
//   await connectDB();

//   /* 1️⃣  Read query params  ------------------------------------ */
//   const { searchParams } = new URL(req.url);
//   const scope  = (searchParams.get("scope") || "all").toLowerCase();  // all | my | friends
//   const page   = parseInt(searchParams.get("page")  || "1");
//   const limit  = parseInt(searchParams.get("limit") || "10");

//   /* 2️⃣  Build Mongo filter  ----------------------------------- */
//   let filter: Record<string, any> = {};

//   if (scope === "my" || scope === "friends") {
//     // need to know who the user is
//     const auth = authenticateRequest(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, message: auth.error },
//         { status: 401 }
//       );
//     }
//     const { userId } = auth;

//     if (scope === "my") {
//       filter.user = userId;
//     } else if (scope === "friends") {
//       // grab the caller’s friends list
//       const user = await User.findById(userId).select("friends").lean();
//       const friendIds = user?.friends ?? [];
//       filter.user = { $in: friendIds };
//     }
//   }
//   // scope === "all" keeps an empty filter → all posts

//   /* 3️⃣  Query + paginate  ------------------------------------- */
//   const total = await Post.countDocuments(filter);

//   const posts = await Post.find(filter)
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .populate("user", "name image")      // send back author name + avatar
//     .lean();

    
//   /* 4️⃣  Respond  ---------------------------------------------- */
//   return NextResponse.json({
//     total,
//     totalPages: Math.ceil(total / limit),
//     page,
//     limit,
//     data: posts,
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/utils/auth";
import User from "@/models/User";
import Post from "@/models/Post";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const scope = (searchParams.get("scope") || "all").toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const filter: Record<string, any> = {};
  let userId: string | null = null;

  // 🔐 Authenticate for "my" or "friends"
  if (scope === "my" || scope === "friends") {
    const auth = authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }
    userId = auth.userId;

    if (scope === "my") {
      filter.user = userId;
    } else {
      const user = await User.findById(userId).select("friends").lean();
      const friendIds = user?.friends ?? [];
      filter.user = { $in: friendIds };
    }
  } else {
    // still try to identify viewer for "liked" field
    const auth = authenticateRequest(req);
    if (!auth.error) userId = auth.userId;
  }

  const total = await Post.countDocuments(filter);

  const rawPosts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "name image")
    .lean();

  // ✅ Add likesCount and liked to each post
  const posts = rawPosts.map((post) => {
    const likes = post.likes || [];
    const likesCount = likes.length;
    const liked = userId ? likes.some((id: any) => id.toString() === userId) : false;

    return {
      ...post,
      likesCount,
      liked,
    };
  });

  return NextResponse.json({
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
    data: posts,
  });
}
