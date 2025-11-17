import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionUserFromRequest } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";
import {
  createBook,
  listBooks,
  getCategories,
} from "@/services/bookService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    let includeHidden = searchParams.get("includeHidden") === "true";
    if (includeHidden) {
      const user = await getSessionUserFromRequest(request);
      if (user?.role !== "ADMIN") {
        includeHidden = false;
      }
    }
    const books = await listBooks({ search, category, includeHidden });
    const categories = await getCategories();
    return NextResponse.json({ books, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to fetch books" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = bookSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid book data", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const book = await createBook(parsed.data, user.id);
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to create book" },
      { status: 500 },
    );
  }
}

