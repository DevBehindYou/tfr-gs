import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken } from "../../../lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin credentials are not configured",
        },
        { status: 500 }
      );
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}