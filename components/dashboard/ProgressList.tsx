import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressItem {
  _id: string;
  currentPage?: number;
  totalPages?: number;
  book: {
    _id: string;
    title: string;
    category: string;
    coverImage?: string;
  };
}

interface ProgressListProps {
  title: string;
  items: ProgressItem[];
  emptyLabel: string;
  completed?: boolean;
}

export function ProgressList({
  title,
  items,
  emptyLabel,
  completed = false,
}: ProgressListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {completed ? (
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        ) : (
          <Clock className="h-4 w-4 text-amber-500" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        )}
        {items.map((item) => (
          <Link
            key={item._id}
            href={item.book?._id ? `/books/${item.book._id}` : "#"}
            className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted"
          >
            <div>
              <p className="font-medium">{item.book?.title ?? "Untitled book"}</p>
              <p className="text-sm text-muted-foreground">
                {item.book?.category ?? "Uncategorized"}
              </p>
              {!completed && item.totalPages && (
                <p className="text-xs text-muted-foreground">
                  Page {item.currentPage} of {item.totalPages}
                </p>
              )}
            </div>
            <Badge variant={completed ? "secondary" : "outline"}>
              {completed ? "Finished" : "In progress"}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

