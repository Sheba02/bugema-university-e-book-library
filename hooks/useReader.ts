"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function readerFetch<T>(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Unable to load progress");
  }

  if (res.status === 204) {
    return null as T;
  }

  return (await res.json()) as T;
}

export function useReader(bookId?: string, totalPages = 1) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: progressData } = useQuery({
    queryKey: ["progress", bookId],
    queryFn: () =>
      readerFetch<{ progress: { currentPage: number } | null }>(
        `/api/books/${bookId}/progress`,
      ).then((res) => res.progress),
    enabled: Boolean(bookId),
  });

  useEffect(() => {
    if (progressData?.currentPage) {
      setCurrentPage(progressData.currentPage);
    }
  }, [progressData]);

  const mutation = useMutation({
    mutationFn: (page: number) =>
      readerFetch(`/api/books/${bookId}/progress`, {
        method: "POST",
        body: JSON.stringify({
          currentPage: page,
          totalPages,
          bookId,
        }),
      }),
    onSuccess: (_, page) => {
      setCurrentPage(page);
      void queryClient.invalidateQueries({ queryKey: ["progress", bookId] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-progress"] });
    },
  });

  const goToPage = (page: number) => {
    if (!bookId) return;
    const safePage = Math.max(1, Math.min(totalPages, page));
    void mutation.mutateAsync(safePage);
  };

  return {
    currentPage,
    goToPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
    isUpdating: mutation.isPending,
  };
}

