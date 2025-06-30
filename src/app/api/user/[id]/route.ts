// app/api/users/[id]/route.ts
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const auth = authenticateRequest(req);
        if (auth.error) {
          return NextResponse.json(
            { success: false, message: auth.error },
            { status: 401 }
          );
        }
        // const { userId } = auth;
    
   

    const userId = params.id;

    // Find the user by ID and exclude sensitive fields
    const user = await User.findById(userId)
      .select('-password -email -createdAt -updatedAt -__v')
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...user,
          _id: user._id.toString()
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user'
      },
      { status: 500 }
    );
  }
}