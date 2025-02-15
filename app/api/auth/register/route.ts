import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await dbConnect()
        const {email,name,password} =await req.json()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        const hashedPassword = password? await bcrypt.hash(password,10):null

        const newUser = await User.create({
            email,
            password:hashedPassword,
            name,
            image:"",
            cart:[],
            isAdmin:false
        })
        return NextResponse.json({message:"User created successfully",user:newUser._id},{status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Something went wrong"},{status:500})
    }
}