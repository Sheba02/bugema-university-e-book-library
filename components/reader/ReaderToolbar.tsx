"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReaderToolbarProps {
  currentPage: number;
  totalPages: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isSaving?: boolean;
}

export function ReaderToolbar({
  currentPage,
  totalPages,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  isSaving,
}: ReaderToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 shadow">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={!canGoPrev || isSaving}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext || isSaving}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3 text-sm font-medium">
        <Badge variant="secondary">
          Page {currentPage} / {totalPages}
        </Badge>
        {isSaving && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving…
          </span>
        )}
      </div>
    </div>
  );
}