"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardResponse {
  inProgress: Array<{
    _id: string;
    currentPage: number;
    totalPages: number;
    completed: boolean;
    book: {
      _id: string;
      title: string;
      category: string;
      coverImage?: string;
    };
  }>;
  completed: Array<{
    _id: string;
    book: {
      _id: string;
      title: string;
      category: string;
      coverImage?: string;
    };
  }>;
}

interface AdminDashboardResponse {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  stats: {
    totalUsers: number;
    bookCount: number;
    completedSessions: number;
  };
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ["dashboard-progress"],
    queryFn: () =>
      fetch("/api/progress", { credentials: "include" }).then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load progress");
        }
        return res.json().then((data: { progress: DashboardResponse }) => data.progress);
      }),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () =>
      fetch("/api/users", { credentials: "include" }).then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load admin data");
        }
        return res.json() as Promise<AdminDashboardResponse>;
      }),
  });
}

