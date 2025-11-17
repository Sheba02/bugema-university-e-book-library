"use client";

import Image from "next/image";

import { ReaderToolbar } from "@/components/reader/ReaderToolbar";
import { useReader } from "@/hooks/useReader";
import type { BookDTO } from "@/services/bookService";

export function ReaderClient({ book }: { book: BookDTO }) {
  const totalPages = Math.max(1, book.pages.length || 1);
  const { currentPage, goToPage, canGoNext, canGoPrev, isUpdating } = useReader(
    book._id.toString(),
    totalPages,
  );

  const pageIndex = Math.max(0, Math.min(book.pages.length - 1, currentPage - 1));
  const currentImage = book.pages[pageIndex] || book.pages[0];

  return (
    <div className="space-y-6">
      <ReaderToolbar
        currentPage={currentPage}
        totalPages={book.pages.length}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        isSaving={isUpdating}
        onNext={() => goToPage(currentPage + 1)}
        onPrev={() => goToPage(currentPage - 1)}
      />
      {currentImage ? (
        <div className="overflow-hidden rounded-2xl border bg-muted/40 p-4 shadow">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-4xl">
            <Image
              src={currentImage}
              alt={`${book.title} page ${currentPage}`}
              fill
              sizes="(max-width: 768px) 90vw, 768px"
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          This book has no pages yet. Upload JPG files to{" "}
          <code>/public/books/{book.folder}</code>.
        </div>
      )}
    </div>
  );
}

