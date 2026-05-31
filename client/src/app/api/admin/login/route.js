import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "admin@vitarchive.com";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPass) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      
      const response = NextResponse.json({ success: true, message: "Logged in successfully" });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
