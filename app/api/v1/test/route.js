import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    backend: process.env.BACKEND_PUBLIC_URL,
    publicBackend: process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL,
  });
}