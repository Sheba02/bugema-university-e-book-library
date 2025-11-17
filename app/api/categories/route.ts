import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ensureRole } from "@/middleware/auth";
import { categorySchema } from "@/lib/validators";
import Book from "@/models/Book";
import { getCategories } from "@/services/bookService";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await ensureRole(request, ["ADMIN"]);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (parsed.data.currentName) {
      await Book.updateMany(
        { category: parsed.data.currentName },
        { category: parsed.data.newName },
      );
    }

    return NextResponse.json({ category: parsed.data.newName });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update categories" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await ensureRole(request, ["ADMIN"]);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 },
      );
    }

    await Book.updateMany({ category: name }, { category: "Uncategorized" });
    return NextResponse.json({ category: "Uncategorized" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to delete category" },
      { status: 500 },
    );
  }
}

