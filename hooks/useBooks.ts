"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { BookInput } from "@/lib/validators";
import type { BookDTO } from "@/services/bookService";

async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

interface BookFilters {
  search?: string;
  category?: string;
  includeHidden?: boolean;
}

export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: ["books", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.category && filters.category !== "all") {
        params.set("category", filters.category);
      }
      if (filters?.includeHidden) {
        params.set("includeHidden", "true");
      }
      const query = params.toString();
      const url = query ? `/api/books?${query}` : "/api/books";
      return apiFetch<{ books: BookDTO[] }>(url).then((res) => res.books);
    },
  });
}

export function useBookMutation(bookId?: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["books"] }),
      queryClient.invalidateQueries({ queryKey: ["book", bookId] }),
    ]);

  const createMutation = useMutation({
    mutationFn: (payload: BookInput) =>
      apiFetch<{ book: BookDTO }>("/api/books", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<BookInput>) =>
      apiFetch<{ book: BookDTO }>(`/api/books/${bookId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/books/${bookId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void invalidate();
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: (visible: boolean) =>
      apiFetch(`/api/books/${bookId}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ isVisible: visible }),
      }),
    onSuccess: () => {
      void invalidate();
    },
  });

  return {
    createBook: createMutation.mutateAsync,
    updateBook: updateMutation.mutateAsync,
    deleteBook: deleteMutation.mutateAsync,
    toggleVisibility: (visible: boolean) =>
      toggleVisibility.mutateAsync(visible),
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleVisibility.isPending,
    error:
      createMutation.error?.message ||
      updateMutation.error?.message ||
      deleteMutation.error?.message ||
      toggleVisibility.error?.message ||
      null,
  };
}

export function useBook(bookId?: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () =>
      apiFetch<{ book: BookDTO }>(`/api/books/${bookId}`).then(
        (res) => res.book,
      ),
    enabled: Boolean(bookId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiFetch<{ categories: string[] }>("/api/categories").then(
        (res) => res.categories,
      ),
  });
}

