import type {
  AppointmentDetailsDto,
  AppointmentFilter,
  AppointmentInput,
  AppointmentQueueDto,
  AuthResponse,
  HaircutTypeDto,
  LoginRequest,
  RegisterRequest,
  UserDto,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5135/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | undefined>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, query } = options;

  let url = `${BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v != null && v !== "") params.set(k, v);
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "אין חיבור לשרת. ודאו שה-API פועל ונסו שוב.");
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const problem = data as { detail?: string; title?: string } | null;
    const message =
      problem?.detail ||
      problem?.title ||
      (res.status === 401 ? "נדרשת התחברות מחדש." : "אירעה שגיאה. נסו שוב.");
    throw new ApiError(res.status, message);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const authApi = {
  register: (body: RegisterRequest) =>
    request<AuthResponse>("/auth/register", { method: "POST", body }),
  login: (body: LoginRequest) =>
    request<AuthResponse>("/auth/login", { method: "POST", body }),
  me: (token: string) => request<UserDto>("/auth/me", { token }),
};

export const haircutTypesApi = {
  list: (token: string) => request<HaircutTypeDto[]>("/haircut-types", { token }),
};

export const appointmentsApi = {
  list: (token: string, filter: AppointmentFilter = {}) =>
    request<AppointmentQueueDto[]>("/appointments", {
      token,
      query: {
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        customerName: filter.customerName,
      },
    }),
  get: (token: string, id: number) =>
    request<AppointmentDetailsDto>(`/appointments/${id}`, { token }),
  create: (token: string, input: AppointmentInput) =>
    request<AppointmentDetailsDto>("/appointments", { method: "POST", body: input, token }),
  update: (token: string, id: number, input: AppointmentInput) =>
    request<AppointmentDetailsDto>(`/appointments/${id}`, { method: "PUT", body: input, token }),
  remove: (token: string, id: number) =>
    request<void>(`/appointments/${id}`, { method: "DELETE", token }),
};
