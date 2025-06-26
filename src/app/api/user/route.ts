import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';
import cloudinary from '@/lib/cloudinary';


// GET user profile
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
     // Get user ID from token
    const auth = authenticateRequest(req);
    if (auth.error) 
        return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        { status: 401 }
      );
    const { userId } = auth;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User profile fetched successfully',
        data: {
          name: user.name,
          email: user.email,
          image: user.image || ''
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user profile',
      },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(req: NextRequest) {
  try {

    await connectDB();
    
    // Get user ID from token
    const auth = authenticateRequest(req);
    if (auth.error) 
        return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        { status: 401 }
      );
    const { userId } = auth;

    // Handle FormData
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const imageFile = formData.get('image') as File | null;
    const updateData: any = { name , email};
    


    // Handle image upload
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
        const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: 'profile_pictures', 
        });
        updateData.image = uploadResponse.secure_url; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: {
          name: updatedUser?.name,
          email: updatedUser?.email,
          image: updatedUser?.image || '',
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}