import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
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
    console.log(user.fname,'user');
    

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image || '',
          friendsCount: user.friends?.length || 0,
          coverimage: user.coverimage || '',
          bio: user.bio || '',
          fname: user.fname || '',

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
    const bio = formData.get('bio') as string;
    const imageFile = formData.get('image') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const updateData: Partial<IUser> = { name , email, bio };
        // Handle image upload
    if (coverFile) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
        const base64Image = `data:${coverFile.type};base64,${buffer.toString("base64")}`;
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: 'profile_pictures', 
        });
        updateData.coverimage = uploadResponse.secure_url; 
    }


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
          coverimage: updatedUser?.coverimage || '',
          bio: updatedUser?.bio
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