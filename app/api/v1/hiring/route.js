import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const response = await fetch(
      `${process.env.BACKEND_PUBLIC_URL}/send-hiring-email`,
      {
        method: "POST",
        body: formData,
      }
    );

    const contentType = response.headers.get("content-type");

    let result;

    if (contentType?.includes("application/json")) {
      result = await response.json();
    } else {
      result = {
        success: false,
        message: await response.text(),
      };
    }

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Hiring API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}