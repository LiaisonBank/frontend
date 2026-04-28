// app/api/enquiry/route.js

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://liaisonbank.frappe.cloud/api/method/create_enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}