import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { issueTokens, setAuthCookies } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { createUser, findUserByEmail } from "@/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existingUser = await findUserByEmail(parsed.data.email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 },
      );
    }

    const user = await createUser(parsed.data);
    const tokens = await issueTokens(user);
    const response = NextResponse.json({ user: tokens.sessionUser }, { status: 201 });
    setAuthCookies(tokens);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to complete registration" },
      { status: 500 },
    );
  }
}

