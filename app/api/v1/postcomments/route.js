import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      postId,
      postSlug,
      postTitle,
      name,
      email,
      comment,
    } = body;

    if (!name || !email || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    /**
     * Save to Database
     *
     * Example:
     * await prisma.comments.create({
     *   data: {
     *     postId,
     *     postSlug,
     *     postTitle,
     *     name,
     *     email,
     *     comment,
     *     status: "pending"
     *   }
     * })
     */

    console.log({
      postId,
      postSlug,
      postTitle,
      name,
      email,
      comment,
    });

    return NextResponse.json({
      success: true,
      message: "Comment submitted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}