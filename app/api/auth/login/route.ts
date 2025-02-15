import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request:  Request){
   try {
      await dbConnect()
      const body =await request.json()

      const {email,password}=body
      if(!email || !password){
        return NextResponse.json({error:"Email and password are required"},{status:400})
      }

      const user = await User.findOne({email:email.toLowerCase()})

      if(!user){
        return NextResponse.json({error:"User not found"},{status:400})
      }

      if (!user.password) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "This account uses Google login. Please sign in with Google." }),
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(password,user.password)

      if(!isMatch){
        return NextResponse.json({error:"Invalid password"},{status:400})
      }

      const token =jwt.sign(
       { id:user._id.toString(),
        email:user.email,
        name:user.name},process.env.JWT_SECRET! as string,{expiresIn:"7d"}
      )

      return NextResponse.json({message:"User logged in successfully",token},{status:200})
   } catch (error) {
      console.log(error)
      return NextResponse.json({error:"Something went wrong"},{status:500})
   }
}