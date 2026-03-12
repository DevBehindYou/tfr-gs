import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Blog from "../../models/Blog";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";

    let blogs;

    if (query) {
      blogs = await Blog.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
          { tags: { $elemMatch: { $regex: query, $options: "i" } } },
          { platform: { $regex: query, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });
    } else {
      blogs = await Blog.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("API GET /api/blogs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const blog = await Blog.create(body);

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API POST /api/blogs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}