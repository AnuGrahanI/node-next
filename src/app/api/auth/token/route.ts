// import { NextRequest, NextResponse } from "next/server";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// const SECRET = process.env.NEXTAUTH_SECRET!;

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { token } = await req.json();

//     if (!token) {
//       return NextResponse.json({ error: "Token is required" }, { status: 400 });
//     }

//     try {
//       // First, try verifying the token as a valid access/refresh token signed by your app
//       const decoded = jwt.verify(token, SECRET) as JwtPayload;
//       const email = decoded?.email;

//       if (!email) {
//         return NextResponse.json({ error: "Invalid ID token" }, { status: 400 });
//       }
//        const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }
     

//       const payload = {
//         id: user.id,
//         name: user.name,
//         email: user.email,

//       };

//       const newAccessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" },);
//       const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });


//       return NextResponse.json({
//         user: payload,
//         accessToken: newAccessToken,
//         refreshToken,
//         expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
//       });
//     } catch (verifyError) {
//       console.log("Error verifying token:", verifyError);
      
//       const decoded = jwt.decode(token) as JwtPayload;

//       const email = decoded?.email;

//       if (!email) {
//         return NextResponse.json({ error: "Invalid ID token" }, { status: 400 });
//       }

//       // Find or create user
//       const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }
     

//       const payload = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       };

//       const accessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" });
//       const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });
      

//       return NextResponse.json({
//         user: payload,
//         accessToken,
//         refreshToken,
//         expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
//       });
//     }
//   } catch (err) {
//     console.error("Token error:", err);
//     return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const SECRET = process.env.NEXTAUTH_SECRET!;

/* ---------- Nodemailer ---------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------- Simple temp‑password generator ---------- */
function generateTempPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token, image } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    /* -------------------------------------------------
     * 1) Try to verify token signed by *our* backend
     * ------------------------------------------------- */
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(token, SECRET) as JwtPayload;
    } catch {
      /* ignore, may be a social / ID token */
    }

    /* -------------------------------------------------
     * 2) If verify failed, just decode it (social token)
     * ------------------------------------------------- */
    if (!decoded) {
      decoded = jwt.decode(token) as JwtPayload | null;
    }
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const email = decoded.email;
    const name =
      decoded.name ||
      `${decoded.given_name ?? ""} ${decoded.family_name ?? ""}`.trim() ||
      "PEZU User";
    const picture = image || decoded.picture || "";

    /* -------------------------------------------------
     * 3) Find or create user
     * ------------------------------------------------- */
    let user = await User.findOne({ email });

    if (!user) {
      /* ---- new user path ---- */
      const tempPassword = generateTempPassword(6);
      const hashed = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        email,
        name,
        username: email.split("@")[0], // simple username
        image: picture,
        password: hashed,
        emailVerified: true,
      });

      /* ---- send welcome e‑mail ---- */
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "PEZU – Your Temporary Password",
        html: `
          <h1>Welcome to PEZU!</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been created.</p>
          <p><strong>Temporary Password:</strong></p>
          <h3 style="letter-spacing:2px">${tempPassword}</h3>
          <p>Please log in and change your password as soon as possible.</p>
          <p>– The PEZU Team</p>
        `,
      });
    }

    /* -------------------------------------------------
     * 4) Issue fresh access & refresh tokens
     * ------------------------------------------------- */
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    const accessToken = jwt.sign(payload, SECRET, { expiresIn: "10h" });
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });

    return NextResponse.json(
      {
        user: payload,
        accessToken,
        refreshToken,
        expiresAt: new Date(
          Date.now() + 10 * 60 * 60 * 1000
        ).toISOString(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Token processing failed" },
      { status: 500 }
    );
  }
}
