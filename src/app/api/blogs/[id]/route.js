import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Blog from "../../../models/Blog";

export async function PUT(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog id",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("PUT blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog id",
        },
        { status: 400 }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}