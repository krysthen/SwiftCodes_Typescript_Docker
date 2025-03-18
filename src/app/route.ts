import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Bad request" },
    { status: 400 });
}
