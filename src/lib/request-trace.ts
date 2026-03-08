import { randomUUID } from "crypto";

export function getRequestId(headers?: Headers) {
  const upstream = headers?.get("x-request-id") || headers?.get("x-correlation-id");
  return upstream || randomUUID();
}

export function logInfo(requestId: string, message: string, meta?: Record<string, unknown>) {
  console.info(JSON.stringify({ level: "info", requestId, message, ...meta }));
}

export function logError(requestId: string, message: string, meta?: Record<string, unknown>) {
  console.error(JSON.stringify({ level: "error", requestId, message, ...meta }));
}
