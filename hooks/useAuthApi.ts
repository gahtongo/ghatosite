"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuthApi() {
  const router = useRouter();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("gahto_admin_token")
        : null;

      if (!token) {
        router.replace("/admin/login");
        throw new Error("No authentication token found");
      }

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem("gahto_admin_token");
          router.replace("/admin/login");
          throw new Error("Session expired. Please login again.");
        }

        return response;
      } catch (error) {
        // If it's a network error or other fetch error, rethrow
        if (error instanceof Error && error.message === "Session expired. Please login again.") {
          throw error;
        }
        throw error;
      }
    },
    [router]
  );

  return authFetch;
}