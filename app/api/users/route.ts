import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ensureRole } from "@/middleware/auth";
import { getAdminAnalytics } from "@/services/progressService";
import { listUsers, updateUserRole } from "@/services/userService";

export async function GET(request: NextRequest) {
  const user = await ensureRole(request, ["ADMIN"]);
  if (user instanceof NextResponse) return user;

  try {
    const [users, stats] = await Promise.all([
      listUsers(),
      getAdminAnalytics(),
    ]);
    return NextResponse.json({
      users,
      stats: {
        totalUsers: users.length,
        ...stats,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load users" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await ensureRole(request, ["ADMIN"]);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { userId, role } = body;
    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 },
      );
    }

    const updated = await updateUserRole(userId, role);
    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update user" },
      { status: 500 },
    );
  }
}

