"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Trash } from "lucide-react";

import type { BookDTO } from "@/services/bookService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookTableProps {
  books: BookDTO[];
  onToggleVisibility: (bookId: string, visible: boolean) => Promise<void>;
  onDelete: (bookId: string) => Promise<void>;
}

export function BookTable({
  books,
  onToggleVisibility,
  onDelete,
}: BookTableProps) {
  const [pending, setPending] = useState<string | null>(null);

  const handleVisibility = async (book: BookDTO) => {
    setPending(book._id.toString());
    try {
      await onToggleVisibility(book._id.toString(), !book.isVisible);
    } finally {
      setPending(null);
    }
  };

  const handleDelete = async (book: BookDTO) => {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    setPending(book._id.toString());
    try {
      await onDelete(book._id.toString());
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Pages</th>
            <th className="px-4 py-3 font-medium">Visibility</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id.toString()} className="border-t">
              <td className="px-4 py-3">
                <div className="font-medium">{book.title}</div>
                <p className="text-xs text-muted-foreground">
                  {book.description?.slice(0, 80)}
                </p>
              </td>
              <td className="px-4 py-3">
                <Badge>{book.category}</Badge>
              </td>
              <td className="px-4 py-3">{book.pages.length}</td>
              <td className="px-4 py-3">
                <Badge variant={book.isVisible ? "secondary" : "outline"}>
                  {book.isVisible ? "Visible" : "Hidden"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisibility(book)}
                    disabled={pending === book._id.toString()}
                  >
                    {pending === book._id.toString() ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : book.isVisible ? (
                      <>
                        <EyeOff className="mr-1 h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-4 w-4" />
                        Show
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book)}
                    disabled={pending === book._id.toString()}
                  >
                    {pending === book._id.toString() ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash className="mr-1 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-muted-foreground"
              >
                No books uploaded yet. Use the form above to add your first
                book. Remember to upload page images into{" "}
                <code>public/books/&lt;folder&gt;</code>.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

