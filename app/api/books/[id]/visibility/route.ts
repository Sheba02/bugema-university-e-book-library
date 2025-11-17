import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionUserFromRequest } from "@/lib/auth";
import { toggleBookVisibility } from "@/services/bookService";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const book = await toggleBookVisibility(params.id, body.isVisible);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update visibility" },
      { status: 500 },
    );
  }
}

