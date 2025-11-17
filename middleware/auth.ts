import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionUserFromRequest, type SessionUser } from "@/lib/auth";
import type { UserRole } from "@/models/User";

export async function ensureAuthenticated(
  request: NextRequest,
): Promise<SessionUser | NextResponse> {
  const user = await getSessionUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return user;
}

export async function ensureRole(
  request: NextRequest,
  roles: UserRole[],
): Promise<SessionUser | NextResponse> {
  const user = await getSessionUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (roles.length && !roles.includes(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return user;
}

