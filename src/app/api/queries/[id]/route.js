import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Query from "../../../models/Query";

function isValidStatus(status) {
  return ["new", "in-progress", "resolved"].includes(status);
}

export async function PATCH(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status.",
        },
        { status: 400 }
      );
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedQuery) {
      return NextResponse.json(
        {
          success: false,
          message: "Query not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully.",
        data: {
          id: updatedQuery._id.toString(),
          status: updatedQuery.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/queries/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating the query.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedQuery = await Query.findByIdAndDelete(id);

    if (!deletedQuery) {
      return NextResponse.json(
        {
          success: false,
          message: "Query not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Query deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/queries/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the query.",
      },
      { status: 500 }
    );
  }
}