export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  date_joined: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: AuthUser;
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

export async function registerUser(
  input: RegisterInput,
): Promise<AuthUser> {
  const response = await fetch("/api/auth/register", {
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
        "Could not create the account.",
    );
  }

  return (data as AuthResponse).user;
}

export async function loginUser(
  input: LoginInput,
): Promise<AuthUser> {
  const response = await fetch("/api/auth/login", {
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
        "Could not log in.",
    );
  }

  return (data as AuthResponse).user;
}

export async function getCurrentUser(): Promise<
  AuthUser | null
> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not load the current user.",
    );
  }

  return data as AuthUser;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractApiError(data) ||
        "Could not log out.",
    );
  }
}