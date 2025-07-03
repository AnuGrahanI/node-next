import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { otpMap } from "@/lib/otp-store/otp";


// Configure email transporter (use env vars in production)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (user) return NextResponse.json({ message: "User already exists" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMap.set(email, otp);

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your PEZU verification code',
        html: `
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <h2 style="letter-spacing:4px">${otp}</h2>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn’t request it, just ignore this mail.</p>
        `,
    });

    return NextResponse.json({ message: "OTP sent to email" , success: true}, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ message: "Failed to send OTP", success: false }, { status: 500 });
  }
}
