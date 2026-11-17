import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.INTASEND_SECRET_KEY) return NextResponse.json({ error: "Payment provider is not configured." }, { status: 503 });
  return NextResponse.json({ error: "Payment initiation requires an order reference and is not enabled until IntaSend credentials are verified." }, { status: 501 });
}
