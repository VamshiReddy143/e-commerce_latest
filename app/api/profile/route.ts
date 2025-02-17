
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

import { isValidObjectId } from 'mongoose';
import { getServerSession } from "next-auth";

import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { authOptions } from "@/app/auth/authOptions";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const formData = await request.formData();
        const userId = formData.get("userId")?.toString();
        const newName = formData.get("name")?.toString();
        const imageFile = formData.get("image");


        // Validate the userId
        if (!userId || !isValidObjectId(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID" },
                { status: 400 }
            );
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Update the name if provided
        if (newName) {
            user.name = newName;
        }
        if (imageFile && imageFile instanceof File) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
      
            const uploadStream = () =>
              new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(result);
                });
                stream.end(buffer);
              });
      
            const cloudImage = await uploadStream();
            user.image = cloudImage.secure_url; // Save the secure URL of the uploaded image
          }


        await user.save();

        return NextResponse.json(
            { success: true, message: "Profile updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}




export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }



        let userId: string | mongoose.Types.ObjectId = session.user?.id;



        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const existingUser = await User.findOne({ email: session.user?.email }).select("_id");
            if (!existingUser) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }
            userId = existingUser._id;
        } else {
            userId = new mongoose.Types.ObjectId(userId);
        }

        const user = await User.findById(userId)


        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                image: user.image,
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
