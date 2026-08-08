import { cookies } from "next/headers";

const API_BASE_URL = (
  process.env.API_BASE_URL ??
  "http://127.0.0.1:8000/api"
)
  .trim()
  .replace(/\/+$/, "");

const ACCESS_COOKIE = "clinic_access_token";
const REFRESH_COOKIE = "clinic_refresh_token";

const ACCESS_MAX_AGE = 30 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  date_joined: string;
};

export type BackendAuthResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export async function readBackendResponse(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    detail:
      text ||
      "The backend returned an invalid response.",
  };
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const cookieStore = await cookies();

  const isProduction =
    process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<
  string | null
> {
  const cookieStore = await cookies();

  return (
    cookieStore.get(ACCESS_COOKIE)?.value ?? null
  );
}

export async function getRefreshToken(): Promise<
  string | null
> {
  const cookieStore = await cookies();

  return (
    cookieStore.get(REFRESH_COOKIE)?.value ?? null
  );
}

export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
  });
}

export async function refreshAccessToken(): Promise<
  string | null
> {
  const currentRefreshToken =
    await getRefreshToken();

  if (!currentRefreshToken) {
    await clearAuthCookies();
    return null;
  }

  const response = await backendFetch(
    "/auth/refresh/",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: currentRefreshToken,
      }),
    },
  );

  if (!response.ok) {
    await clearAuthCookies();
    return null;
  }

  const data = (await response.json()) as {
    access?: unknown;
    refresh?: unknown;
  };

  if (
    typeof data.access !== "string" ||
    !data.access.trim()
  ) {
    await clearAuthCookies();
    return null;
  }

  const nextRefreshToken =
    typeof data.refresh === "string" &&
    data.refresh.trim()
      ? data.refresh
      : currentRefreshToken;

  await setAuthCookies(
    data.access,
    nextRefreshToken,
  );

  return data.access;
}

function createAuthenticatedInit(
  init: RequestInit,
  accessToken: string,
): RequestInit {
  const headers = new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${accessToken}`,
  );

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return {
    ...init,
    headers,
    cache: "no-store",
  };
}

export async function fetchBackendWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response | null> {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    accessToken = await refreshAccessToken();
  }

  if (!accessToken) {
    return null;
  }

  let response = await backendFetch(
    path,
    createAuthenticatedInit(
      init,
      accessToken,
    ),
  );

  if (response.status !== 401) {
    return response;
  }

  accessToken = await refreshAccessToken();

  if (!accessToken) {
    return null;
  }

  response = await backendFetch(
    path,
    createAuthenticatedInit(
      init,
      accessToken,
    ),
  );

  return response;
}