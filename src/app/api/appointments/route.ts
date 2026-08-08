import { NextResponse } from "next/server";

import {
  fetchBackendWithAuth,
  readBackendResponse,
} from "@/lib/server/auth";

function authenticationRequired() {
  return NextResponse.json(
    {
      detail: "Authentication is required.",
    },
    {
      status: 401,
    },
  );
}

export async function GET() {
  try {
    const backendResponse =
      await fetchBackendWithAuth("/appointments/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

    if (!backendResponse) {
      return authenticationRequired();
    }

    const responseData =
      await readBackendResponse(backendResponse);

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Appointment list route error:", error);

    return NextResponse.json(
      {
        detail:
          "Could not connect to the appointment backend.",
      },
      {
        status: 502,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const backendResponse =
      await fetchBackendWithAuth("/appointments/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

    if (!backendResponse) {
      return authenticationRequired();
    }

    const responseData =
      await readBackendResponse(backendResponse);

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Appointment create route error:", error);

    return NextResponse.json(
      {
        detail:
          "Could not connect to the appointment backend.",
      },
      {
        status: 502,
      },
    );
  }
}