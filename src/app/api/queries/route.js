import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Query from "../../models/Query";

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const fullName = cleanString(body.fullName);
    const emailAddress = cleanString(body.emailAddress);
    const phoneNumber = cleanString(body.phoneNumber);
    const category = cleanString(body.category);
    const companyName = cleanString(body.companyName);
    const query = cleanString(body.query);
    const newsletter = Boolean(body.newsletter);

    if (!fullName || !emailAddress || !phoneNumber || !category || !query) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const newQuery = await Query.create({
      fullName,
      emailAddress,
      phoneNumber,
      category,
      companyName,
      query,
      newsletter,
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Query submitted successfully.",
        data: {
          id: newQuery._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/queries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting the query.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = cleanString(searchParams.get("search"));
    const status = cleanString(searchParams.get("status"));

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { emailAddress: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { query: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Query.find(filter).sort({ createdAt: -1 }).lean();

    const data = items.map((item) => ({
      id: item._id.toString(),
      fullName: item.fullName || "",
      emailAddress: item.emailAddress || "",
      phoneNumber: item.phoneNumber || "",
      category: item.category || "",
      companyName: item.companyName || "",
      query: item.query || "",
      newsletter: Boolean(item.newsletter),
      status: item.status || "new",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/queries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading queries.",
      },
      { status: 500 }
    );
  }
}