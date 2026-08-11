export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type CreateAppointmentInput = {
  doctorId: number;
  patientName: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
};

export type AppointmentResponse = {
  id: number;
  doctorId: number;
  doctorName: string;
  doctorInitials: string;
  specialty: string;
  patientName: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: AppointmentStatus;
  statusLabel: string;
  canCancel: boolean;
  consultationFee: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentSummary = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  upcoming: number;
  nextAppointment: AppointmentResponse | null;
};

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

    return "";
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

async function readResponse(
  response: Response,
): Promise<unknown> {
  return response.json().catch(() => null);
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<AppointmentResponse> {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not create the appointment.",
    );
  }

  return data as AppointmentResponse;
}

export async function getMyAppointments(): Promise<
  AppointmentResponse[]
> {
  const response = await fetch("/api/appointments", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not load appointments.",
    );
  }

  if (Array.isArray(data)) {
    return data as AppointmentResponse[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.results)) {
      return record.results as AppointmentResponse[];
    }
  }

  return [];
}


export async function getAppointmentSummary(): Promise<AppointmentSummary> {
  const response = await fetch("/api/appointments/summary", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not load appointment summary.",
    );
  }

  return data as AppointmentSummary;
}

export async function cancelAppointmentById(
  appointmentId: number,
): Promise<AppointmentResponse> {
  const response = await fetch(
    `/api/appointments/${appointmentId}/cancel`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not cancel the appointment.",
    );
  }

  return data as AppointmentResponse;
}