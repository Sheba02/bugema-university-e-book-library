import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionUserFromRequest } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";
import {
  deleteBook,
  getBookById,
  updateBook,
} from "@/services/bookService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getSessionUserFromRequest(request);
    const book = await getBookById(params.id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (!book.isVisible && user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to fetch book" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = bookSchema.partial().safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid book data", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const book = await updateBook(params.id, parsed.data);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update book" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const book = await deleteBook(params.id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to delete book" },
      { status: 500 },
    );
  }
}

