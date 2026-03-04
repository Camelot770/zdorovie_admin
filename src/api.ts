const BASE = "/api/admin";

function getToken(): string | null {
  return sessionStorage.getItem("admin_token");
}

export function setToken(token: string) {
  sessionStorage.setItem("admin_token", token);
}

export function clearToken() {
  sessionStorage.removeItem("admin_token");
}

export function hasToken(): boolean {
  return !!getToken();
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── API functions ──

export async function login(password: string): Promise<string> {
  const data = await request<{ token: string }>("POST", "/login", { password });
  setToken(data.token);
  return data.token;
}

export function getStats() {
  return request<{
    total_users: number;
    linked_users: number;
    users_with_chat: number;
    bot_alive: boolean;
    bot_error: string | null;
  }>("GET", "/stats");
}

export function getUsers(search = "") {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<{
    users: Array<{
      max_user_id: string;
      patient_id: string;
      phone: string;
      full_name: string;
      chat_id: string | null;
      created_at: string;
    }>;
    total: number;
  }>("GET", `/users${q}`);
}

export function unlinkUser(maxUserId: string) {
  return request("DELETE", `/users/${maxUserId}`);
}

export function sendBroadcast(message: string) {
  return request<{
    broadcast_id: number;
    total: number;
    sent: number;
    failed: number;
  }>("POST", "/broadcast", { message });
}

export function getBroadcasts() {
  return request<{
    broadcasts: Array<{
      id: number;
      message: string;
      sent_at: string;
      total: number;
      sent: number;
      failed: number;
    }>;
  }>("GET", "/broadcasts");
}

export function sendMessage(chatId: number, message: string) {
  return request("POST", "/send-message", { chat_id: chatId, message });
}

export function getAppointmentsToday() {
  return request<{ appointments: Array<Record<string, unknown>> }>(
    "GET",
    "/appointments/today"
  );
}
