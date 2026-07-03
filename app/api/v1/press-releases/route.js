import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/press-releases/`
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch press releases" },
      { status: 500 }
    );
  }
}

export async function getPressReleaseBySlug(slug) {
  const data = await getPressReleases();

  return data.find((item) => item.slug === slug);
}