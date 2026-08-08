import { NextResponse } from "next/server";

import {
  backendFetch,
  clearAuthCookies,
  getRefreshToken,
} from "@/lib/server/auth";

export async function POST() {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await backendFetch("/auth/logout/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });
    }
  } catch (error) {
    console.error("Logout backend error:", error);
  } finally {
    await clearAuthCookies();
  }

  return NextResponse.json({
    detail: "Logged out successfully.",
  });
}