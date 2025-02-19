import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse("Logged out", { status: 200 });
  response.cookies.delete("session"); 
  return response;
}
