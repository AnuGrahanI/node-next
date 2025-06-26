import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
  [key: string]: any;
}

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as DecodedToken;
  } catch (error) {
    return null;
  }
};

export const authenticateRequest = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authorization token missing' },
        { status: 401 }
      )
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    };
  }

  return { userId: decoded.id };
};