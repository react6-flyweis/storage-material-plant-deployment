import { io, type Socket } from "socket.io-client";

export function getSocketBaseUrl() {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  // trim trailing slash
  return (apiBase || "").replace(/\/$/, "");
}

export function createAdminSocket(
  accessToken: string | null | undefined,
): Socket | null {
  if (!accessToken) return null;

  const namespace = "/admin";
  const base = getSocketBaseUrl();
  return io(`${base}${namespace}`, {
    auth: { token: accessToken },
    transports: ["polling"],
  });
}

export type { Socket };
