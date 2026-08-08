import { NextResponse } from "next/server";

const REQUEST_TIMEOUT = 30000;

export async function GET() {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const API_URL =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_LOCAL_API_URL
        : process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!API_URL) {
      throw new Error("Backend API URL is not configured");
    }

    // IMPORTANT: Backend endpoint
    const backendUrl = `${API_URL.replace(/\/$/, "")}/api/projects/`;

    console.log("Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    console.log("Backend status:", response.status);

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}