import { NextResponse } from "next/server";

import { fetchServerUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await fetchServerUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

