"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BookForm } from "@/components/dashboard/BookForm";
import { BookTable } from "@/components/dashboard/BookTable";
import { AdminOverview } from "@/components/dashboard/AdminOverview";
import { UserTable } from "@/components/dashboard/UserTable";
import { useBooks } from "@/hooks/useBooks";
import { useAdminDashboard } from "@/hooks/useDashboard";
import type { BookInput } from "@/lib/validators";

async function request<T>(
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
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: books = [],
    refetch: refetchBooks,
    isLoading: booksLoading,
  } = useBooks({ includeHidden: true });
  const {
    data: adminData,
    refetch: refetchAdmin,
    isLoading: adminLoading,
  } = useAdminDashboard();

  const refresh = async () => {
    setError(null);
    await Promise.all([refetchBooks(), refetchAdmin()]);
    router.refresh();
  };

  const handleCreateBook = async (payload: BookInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await request("/api/books", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (bookId: string, visible: boolean) => {
    try {
      setError(null);
      await request(`/api/books/${bookId}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ isVisible: visible }),
      });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      setError(null);
      await request(`/api/books/${bookId}`, {
        method: "DELETE",
      });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      setError(null);
      await request("/api/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, role }),
      });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {adminLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        adminData?.stats && <AdminOverview stats={adminData.stats} />
      )}
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <BookForm onSubmit={handleCreateBook} isSubmitting={isSubmitting} />
      {booksLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : (
        <BookTable
          books={books}
          onToggleVisibility={handleToggleVisibility}
          onDelete={handleDeleteBook}
        />
      )}
      {adminData?.users && !adminLoading && (
        <UserTable
          users={adminData.users}
          onRoleChange={handleRoleChange}
          isUpdating={adminLoading}
        />
      )}
    </div>
  );
}

