import { QueryClient } from "@tanstack/react-query";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getApiUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL ?? "https://denapps.replit.app";
}

async function defaultFetcher({ queryKey }: { queryKey: readonly unknown[] }) {
  const path = queryKey[0] as string;
  const url = new URL(path, getApiUrl()).toString();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, { headers });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultFetcher,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export async function apiRequest<T = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const url = new URL(path, getApiUrl()).toString();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
