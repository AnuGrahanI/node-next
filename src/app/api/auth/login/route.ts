import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" });
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: payload,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
