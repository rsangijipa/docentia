import { apiError } from "@/lib/api-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return apiError(
    "INVALID_REQUEST",
    "Legacy endpoint disabled. Create account with Firebase Auth and then call /api/auth/session.",
    410
  );
}
