import { notFound } from "next/navigation";

import { ReaderClient } from "@/app/books/[bookId]/ReaderClient";
import { Badge } from "@/components/ui/badge";
import { fetchServerUser } from "@/lib/auth";
import { getBookById } from "@/services/bookService";

interface ReaderPageParams {
  params: { bookId: string };
}

export default async function BookReaderPage({ params }: ReaderPageParams) {
  const [book, user] = await Promise.all([
    getBookById(params.bookId),
    fetchServerUser(),
  ]);

  if (!book) {
    notFound();
  }

  if (!book.isVisible && user?.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">{book.title}</h1>
          <Badge variant="secondary">{book.category}</Badge>
        </div>
        {book.description && (
          <p className="text-muted-foreground">{book.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Book images are loaded from <code>/public/books/{book.folder}</code>.
          Add or replace files to update this reader.
        </p>
      </div>
      <ReaderClient book={book} />
    </div>
  );
}

