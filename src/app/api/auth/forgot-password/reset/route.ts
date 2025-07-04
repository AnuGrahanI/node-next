import { connectDB } from "@/lib/mongodb";
import { otpMap } from "@/lib/otp-store/otp";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();

  const hashed = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });

  otpMap.delete(email);

  return NextResponse.json({ message: "Password reset successfully" });
}
