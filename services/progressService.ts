import { Types } from "mongoose";

import { connectDB } from "@/lib/db";
import type { ProgressInput } from "@/lib/validators";
import Book from "@/models/Book";
import ReadingProgress from "@/models/ReadingProgress";

export async function upsertReadingProgress(
  userId: string,
  payload: ProgressInput,
) {
  await connectDB();
  const completed = payload.currentPage >= payload.totalPages;

  const progress = await ReadingProgress.findOneAndUpdate(
    { user: userId, book: payload.bookId },
    {
      currentPage: payload.currentPage,
      totalPages: payload.totalPages,
      completed,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  return progress;
}

export async function getReadingProgress(userId: string, bookId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(bookId)) return null;
  return ReadingProgress.findOne({ user: userId, book: bookId }).lean();
}

export async function getDashboardProgress(userId: string) {
  await connectDB();
  const progresses = await ReadingProgress.find({ user: userId })
    .populate("book")
    .lean();

  const inProgress = progresses.filter((p) => !p.completed);
  const completed = progresses.filter((p) => p.completed);

  return {
    inProgress,
    completed,
  };
}

export async function getAdminAnalytics() {
  await connectDB();
  const [bookCount, progressCount] = await Promise.all([
    Book.countDocuments(),
    ReadingProgress.countDocuments({ completed: true }),
  ]);

  return {
    bookCount,
    completedSessions: progressCount,
  };
}

