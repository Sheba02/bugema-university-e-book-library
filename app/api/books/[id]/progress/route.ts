import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ensureAuthenticated } from "@/middleware/auth";
import { progressSchema } from "@/lib/validators";
import {
  getReadingProgress,
  upsertReadingProgress,
} from "@/services/progressService";
import { getBookById } from "@/services/bookService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await ensureAuthenticated(request);
  if (user instanceof NextResponse) return user;

  try {
    const progress = await getReadingProgress(user.id, params.id);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load progress" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await ensureAuthenticated(request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const parsed = progressSchema.safeParse({ ...body, bookId: params.id });
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid progress", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const book = await getBookById(params.id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const progress = await upsertReadingProgress(user.id, {
      ...parsed.data,
      totalPages: book.pages.length,
    });
    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update progress" },
      { status: 500 },
    );
  }
}

