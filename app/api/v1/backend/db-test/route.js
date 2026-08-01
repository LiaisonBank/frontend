import { NextResponse } from "next/server";

export async function GET() {
  // console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/db-test/`
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch backend" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

//   return NextResponse.json({
//     backend: process.env.NEXT_PUBLIC_BACKEND_URL,
//   });
// }