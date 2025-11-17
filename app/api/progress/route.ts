import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ensureAuthenticated } from "@/middleware/auth";
import { getDashboardProgress } from "@/services/progressService";

export async function GET(request: NextRequest) {
  const user = await ensureAuthenticated(request);
  if (user instanceof NextResponse) return user;

  try {
    const progress = await getDashboardProgress(user.id);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load dashboard" },
      { status: 500 },
    );
  }
}

