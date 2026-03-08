import { apiError } from "@/lib/api-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return apiError(
    "INVALID_REQUEST",
    "Legacy endpoint disabled. Use POST /api/auth/session with Firebase ID token.",
    410
  );
}
