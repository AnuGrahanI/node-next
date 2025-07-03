import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // 🔒 for hashing

// Email config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Password generator
function generateTempPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fname, lname, email, username } = await req.json();

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'Username already registered' },
        { status: 400 }
      );
    }

    // Generate and hash temp password
    const tempPassword = generateTempPassword(6);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user
    const user = await User.create({
      fname,
      lname,
      email,
      username: fname + ' ' + lname,
      password: hashedPassword, // 🔐 store hashed password
    });

    // Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PEZU - Your Temporary Password',
      html: `
        <h1>Welcome to PEZU!</h1>
        <p>Hello <strong>${fname} ${lname}</strong>,</p>
        <p>Welcome to <strong>PEZU</strong>! Your account has been created.</p>
        <p><strong>Temporary Password:</strong></p>
        <h3 style="letter-spacing:2px">${tempPassword}</h3>
        <p>Please login and change your password as soon as possible.</p>
        <p>Thanks,<br/>The PEZU Team</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User registered and email sent',
        data: { id: user._id, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
