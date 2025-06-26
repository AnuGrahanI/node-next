import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
      // First, try verifying the token as a valid access/refresh token signed by your app
      const decoded = jwt.verify(token, SECRET) as JwtPayload;
      const email = decoded?.email;

      if (!email) {
        return NextResponse.json({ error: "Invalid ID token" }, { status: 400 });
      }
       let user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
     

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,

      };

      const newAccessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" },);
      const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });


      return NextResponse.json({
        user: payload,
        accessToken: newAccessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
      });
    } catch (verifyError) {
      // Token isn't signed with your secret; treat it as an ID token from an external provider
      const decoded = jwt.decode(token) as JwtPayload;

      const email = decoded?.email;

      if (!email) {
        return NextResponse.json({ error: "Invalid ID token" }, { status: 400 });
      }

      // Find or create user
      let user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
     

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" });
      const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });
      

      return NextResponse.json({
        user: payload,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
      });
    }
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
