import { NextResponse } from "next/server";

const REQUEST_TIMEOUT = 30000; // 30 seconds

export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    const formData = await request.formData();

    const controller = new AbortController();

    const timeout = setTimeout(() => {d
      controller.abort();
    }, REQUEST_TIMEOUT);

    let backendResponse;

    try {
      backendResponse = await fetch(
        `${backendUrl}/send-hiring-email`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          cache: "no-store",
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    const contentType =
      backendResponse.headers.get("content-type") || "";

    let responseData;

    if (contentType.includes("application/json")) {
      responseData = await backendResponse.json();
    } else {
      const text = await backendResponse.text();

      responseData = {
        success: backendResponse.ok,
        message: text || "Unexpected response received from backend.",
      };
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Hiring API Error:", error);

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          message: "Backend request timed out. Please try again.",
        },
        {
          status: 504,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}