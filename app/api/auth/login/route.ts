import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { issueTokens, setAuthCookies } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { validateUser } from "@/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid credentials", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await validateUser(parsed.data.email, parsed.data.password);

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const tokens = await issueTokens(user);
    const response = NextResponse.json({ user: tokens.sessionUser });
    setAuthCookies(tokens);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to login" },
      { status: 500 },
    );
  }
}

