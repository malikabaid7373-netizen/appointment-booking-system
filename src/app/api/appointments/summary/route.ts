import { NextResponse } from "next/server";

import {
  fetchBackendWithAuth,
  readBackendResponse,
} from "@/lib/server/auth";

export async function GET() {
  try {
    const backendResponse = await fetchBackendWithAuth(
      "/appointments/summary/",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );

    if (!backendResponse) {
      return NextResponse.json(
        { detail: "Authentication is required." },
        { status: 401 },
      );
    }

    const data = await readBackendResponse(backendResponse);
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Appointment summary route error:", error);
    return NextResponse.json(
      { detail: "Could not load the dashboard summary." },
      { status: 502 },
    );
  }
}
