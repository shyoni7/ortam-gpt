import { NextResponse } from "next/server";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    // TODO: integrate with email provider (Resend/Mailgun/SES) to send notification

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
