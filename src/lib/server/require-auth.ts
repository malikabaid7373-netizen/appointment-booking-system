import { redirect } from "next/navigation";

import { getAccessToken, getRefreshToken } from "@/lib/server/auth";

export async function requireAuth(returnTo: string) {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  if (!accessToken && !refreshToken) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }
}
