import { Types } from "mongoose";

import { connectDB } from "@/lib/db";
import type { BookInput } from "@/lib/validators";
import Book, { type IBook } from "@/models/Book";

export interface BookQuery {
  search?: string;
  category?: string;
  includeHidden?: boolean;
}

export type BookDTO = Omit<IBook, "createdAt" | "updatedAt" | "_id"> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export function serializeBook(book: any): BookDTO {
  if (!book) throw new Error("Book not found");
  return {
    ...book,
    _id: book._id.toString(),
    createdAt: book.createdAt
      ? new Date(book.createdAt).toISOString()
      : undefined,
    updatedAt: book.updatedAt
      ? new Date(book.updatedAt).toISOString()
      : undefined,
  };
}

export async function listBooks(query: BookQuery = {}) {
  await connectDB();

  const criteria: Record<string, unknown> = {};

  if (query.category) {
    criteria.category = query.category;
  }

  if (!query.includeHidden) {
    criteria.isVisible = true;
  }

  let findQuery = Book.find(criteria).sort({ createdAt: -1 });

  if (query.search) {
    findQuery = Book.find({
      ...criteria,
      $text: { $search: query.search },
    }).sort({ score: { $meta: "textScore" } });
  }

  const docs = await findQuery.lean();
  return docs.map((doc) => serializeBook(doc));
}

export async function getBookById(bookId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(bookId)) return null;
  const book = await Book.findById(bookId).lean();
  return book ? serializeBook(book) : null;
}

export async function createBook(input: BookInput, createdBy?: string) {
  await connectDB();
  const book = await Book.create({
    ...input,
    createdBy,
    coverImage: input.coverImage || input.pages[0],
  });
  return serializeBook(book.toObject());
}

export async function updateBook(bookId: string, input: Partial<BookInput>) {
  await connectDB();
  const book = await Book.findByIdAndUpdate(
    bookId,
    {
      ...input,
      coverImage: input.coverImage || input.pages?.[0],
    },
    { new: true },
  ).lean();
  return book ? serializeBook(book) : null;
}

export async function deleteBook(bookId: string) {
  await connectDB();
  const book = await Book.findByIdAndDelete(bookId).lean();
  return book ? serializeBook(book) : null;
}

export async function toggleBookVisibility(bookId: string, isVisible: boolean) {
  await connectDB();
  const book = await Book.findByIdAndUpdate(
    bookId,
    { isVisible },
    { new: true },
  ).lean();
  return book ? serializeBook(book) : null;
}

export async function getCategories() {
  await connectDB();
  const categories = await Book.distinct("category");
  return categories.sort();
}

export async function getBookSummaries() {
  await connectDB();
  const totalBooks = await Book.countDocuments();
  const visibleBooks = await Book.countDocuments({ isVisible: true });
  return { totalBooks, visibleBooks };
}

