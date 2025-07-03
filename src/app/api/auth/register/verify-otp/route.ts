import { otpMap } from "@/lib/otp-store/otp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  const savedOtp = otpMap.get(email);
  if (savedOtp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

  return NextResponse.json({ message: "OTP verified" });
}
