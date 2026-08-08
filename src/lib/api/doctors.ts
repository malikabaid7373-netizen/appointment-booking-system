export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availableToday: boolean;
  languages: string[];
  initials: string;
  about: string;
  availableDays: string[];
};

export type AvailableSlotsResponse = {
  doctorId: number;
  doctorName: string;
  date: string;
  weekday: string;
  slots: string[];
};

const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://127.0.0.1:8000/api"
)
  .trim()
  .replace(/\/+$/, "");

export async function getDoctors(): Promise<Doctor[]> {
  const response = await fetch(`${API_BASE_URL}/doctors/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load doctors. Status: ${response.status}`,
    );
  }

  return (await response.json()) as Doctor[];
}

export async function getDoctor(
  doctorId: number,
): Promise<Doctor | null> {
  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    return null;
  }

  const response = await fetch(
    `${API_BASE_URL}/doctors/${doctorId}/`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load doctor. Status: ${response.status}`,
    );
  }

  return (await response.json()) as Doctor;
}

function extractApiError(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractApiError(item);

      if (message) {
        return message;
      }
    }
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (
      typeof record.detail === "string" &&
      record.detail.trim()
    ) {
      return record.detail;
    }

    for (const fieldValue of Object.values(record)) {
      const message = extractApiError(fieldValue);

      if (message) {
        return message;
      }
    }
  }

  return "";
}

export async function getAvailableDoctorSlots(
  doctorId: number,
  date: string,
  signal?: AbortSignal,
): Promise<AvailableSlotsResponse> {
  const response = await fetch(
    `/api/doctors/${doctorId}/available-slots?date=${encodeURIComponent(
      date,
    )}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal,
    },
  );

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not load available appointment times.",
    );
  }

  return data as AvailableSlotsResponse;
}