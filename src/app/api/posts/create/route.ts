import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/utils/auth";
import User from "@/models/User";
import Post from "@/models/Post";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs"; // Needed for Buffer

export async function POST(req: NextRequest) {
  await connectDB();

  // 1. 🔒 Authenticate user
  const auth = authenticateRequest(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: 401 }
    );
  }
  const { userId } = auth;

  // 2. 📦 Parse form data
  const formData = await req.formData();
  const text = (formData.get("text") as string) || "";
  const files = formData.getAll("images") as File[];

  if (files.length > 2) {
    return NextResponse.json(
      { success: false, message: "Max 2 images allowed" },
      { status: 400 }
    );
  }

  // 3. ☁️ Upload images using base64
  async function uploadFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "posts",
    });

    return uploadResponse.secure_url;
  }

  const imageUrls = await Promise.all(files.map(uploadFile));

  // 4. 🗄️ Create post
  const post = await Post.create({
    user: userId,
    text,
    images: imageUrls,
  });

  // 5. ➕ Add post ID to user
  await User.findByIdAndUpdate(userId, {
    $push: { posts: post._id },
  });

  return NextResponse.json({ success: true, data: post, message: "Post created" }, { status: 201 });
}
