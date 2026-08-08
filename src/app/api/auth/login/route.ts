import { NextResponse } from "next/server";

import {
  backendFetch,
  type BackendAuthResponse,
  readBackendResponse,
  setAuthCookies,
} from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const backendResponse = await backendFetch(
      "/auth/login/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const responseData =
      await readBackendResponse(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(responseData, {
        status: backendResponse.status,
      });
    }

    const authData =
      responseData as BackendAuthResponse;

    await setAuthCookies(
      authData.access,
      authData.refresh,
    );

    return NextResponse.json({
      user: authData.user,
    });
  } catch (error) {
    console.error("Login route error:", error);

    return NextResponse.json(
      {
        detail:
          "Could not connect to the authentication backend.",
      },
      {
        status: 502,
      },
    );
  }
}