import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    const response = await fetch(
      "https://liaisonbank.frappe.cloud/api/method/frappe_whatsapp.utils.webhook.webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
        },
        body: JSON.stringify({
          to,
          message,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}