"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { BookDTO } from "@/services/bookService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: BookDTO;
  actionLabel?: string;
  onAction?: (book: BookDTO) => void;
  footerSlot?: React.ReactNode;
  showReadLink?: boolean;
}

export function BookCard({
  book,
  actionLabel,
  onAction,
  footerSlot,
  showReadLink = true,
}: BookCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm transition hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <Badge variant="secondary">{book.category}</Badge>
          </div>
          {book.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {book.description}
            </p>
          )}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          {footerSlot}
          <div className="flex items-center gap-2">
            {showReadLink && (
              <Button asChild className="flex-1">
                <Link href={`/books/${book._id}`}>Read</Link>
              </Button>
            )}
            {actionLabel && (
              <Button
                variant="outline"
                className={cn("flex-1", !showReadLink && "w-full")}
                onClick={() => onAction?.(book)}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

