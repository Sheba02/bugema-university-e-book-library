"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { SessionUser } from "@/lib/auth";
import type { LoginInput, RegisterInput } from "@/lib/validators";

async function jsonFetch<T>(
  url: string,
  options?: RequestInit & { skipError?: boolean },
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (options?.skipError && res.status === 401) {
      return null as T;
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  if (res.status === 204) {
    return null as T;
  }

  return (await res.json()) as T;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => jsonFetch<{ user: SessionUser | null }>("/api/auth/me", { skipError: true }).then((res) => res.user),
    staleTime: 1000 * 60,
  });
}

export function useAuthActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginInput) =>
      jsonFetch<{ user: SessionUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      router.refresh();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterInput) =>
      jsonFetch<{ user: SessionUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      router.refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () =>
      jsonFetch<null>("/api/auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      router.refresh();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: () => logoutMutation.mutateAsync(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error:
      loginMutation.error?.message ||
      registerMutation.error?.message ||
      logoutMutation.error?.message ||
      null,
  };
}

