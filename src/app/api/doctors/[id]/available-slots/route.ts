import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://127.0.0.1:8000/api"
)
  .trim()
  .replace(/\/+$/, "");

type AvailableSlotsRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: AvailableSlotsRouteContext,
) {
  try {
    const { id } = await context.params;
    const doctorId = Number(id);

    const date = request.nextUrl.searchParams
      .get("date")
      ?.trim();

    if (
      !Number.isInteger(doctorId) ||
      doctorId <= 0
    ) {
      return NextResponse.json(
        {
          detail: "Invalid doctor ID.",
        },
        {
          status: 400,
        },
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          detail: "Date is required.",
        },
        {
          status: 400,
        },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/doctors/${doctorId}/available-slots/?date=${encodeURIComponent(
        date,
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const contentType =
      backendResponse.headers.get("content-type") ?? "";

    const responseData: unknown = contentType.includes(
      "application/json",
    )
      ? await backendResponse.json()
      : {
          detail:
            (await backendResponse.text()) ||
            "Invalid response from Django backend.",
        };

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Available slots route error:", error);

    return NextResponse.json(
      {
        detail:
          "Could not connect to Django backend. Make sure the backend server is running.",
      },
      {
        status: 502,
      },
    );
  }
}