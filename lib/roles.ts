import type { NextRequest } from "next/server";

import { getSessionUserFromRequest, type SessionUser } from "@/lib/auth";
import type { UserRole } from "@/models/User";

export const ROLES = {
  ADMIN: "ADMIN" as UserRole,
  STUDENT: "STUDENT" as UserRole,
};

export function hasRole(user: SessionUser | null, roles: UserRole[]) {
  if (!user) return false;
  return roles.includes(user.role);
}

export async function requireRole(
  request: NextRequest,
  roles: UserRole[] = [],
) {
  const user = await getSessionUserFromRequest(request);
  if (!user || (roles.length && !roles.includes(user.role))) {
    throw new Error("Forbidden");
  }
  return user;
}

