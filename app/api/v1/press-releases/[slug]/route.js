import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/press-releases/${params.slug}`
    );

    const data = await response.json();
    console.log("API RESPONSE---->", response)

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch press release" },
      { status: 500 }
    );
  }
}