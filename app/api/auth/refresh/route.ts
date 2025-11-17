import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  issueTokens,
  setAuthCookies,
  getSessionUserFromRequest,
  refreshSessionFromRequest,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const refreshed = await refreshSessionFromRequest(request);
    if (refreshed) {
      return new NextResponse(
        JSON.stringify({ user: refreshed.tokens.sessionUser }),
        { headers: refreshed.headers },
      );
    }

    const user = await getSessionUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tokens = await issueTokens(dbUser);
    setAuthCookies(tokens);
    return NextResponse.json({ user: tokens.sessionUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to refresh session" },
      { status: 500 },
    );
  }
}

