import { NextResponse } from "next/server";

import {
  fetchBackendWithAuth,
  readBackendResponse,
} from "@/lib/server/auth";

export async function GET() {
  try {
    const backendResponse =
      await fetchBackendWithAuth("/auth/me/");

    if (!backendResponse) {
      return NextResponse.json(
        {
          detail: "Authentication is required.",
        },
        {
          status: 401,
        },
      );
    }

    const responseData =
      await readBackendResponse(backendResponse);

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Current user route error:", error);

    return NextResponse.json(
      {
        detail:
          "Could not verify the current user.",
      },
      {
        status: 502,
      },
    );
  }
}