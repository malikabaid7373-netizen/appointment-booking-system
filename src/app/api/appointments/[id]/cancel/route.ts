import { NextResponse } from "next/server";

import {
  fetchBackendWithAuth,
  readBackendResponse,
} from "@/lib/server/auth";

type CancelRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: CancelRouteContext,
) {
  try {
    const { id } = await context.params;
    const appointmentId = Number(id);

    if (
      !Number.isInteger(appointmentId) ||
      appointmentId <= 0
    ) {
      return NextResponse.json(
        {
          detail: "Invalid appointment ID.",
        },
        {
          status: 400,
        },
      );
    }

    const backendResponse =
      await fetchBackendWithAuth(
        `/appointments/${appointmentId}/cancel/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        },
      );

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
    console.error("Appointment cancel route error:", error);

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