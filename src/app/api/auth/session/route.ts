import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { authSessionSchema } from "@/lib/api-schemas";
import { apiError, apiSuccess, withRequestId } from "@/lib/api-response";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase-admin";
import { login as setSessionCookie } from "@/lib/auth-service";
import { hitRateLimit } from "@/lib/rate-limit";
import { getRequestId, logError } from "@/lib/request-trace";

function getRequesterIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export async function POST(req: NextRequest) {
  const requestId = getRequestId(req.headers);
  try {
    const ip = getRequesterIp(req);
    const rl = hitRateLimit(`auth-session:${ip}`, 20, 60_000);
    if (rl.limited) {
      return withRequestId(apiError("RATE_LIMITED", "Too many requests. Try again shortly.", 429), requestId);
    }

    const parsed = authSessionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return withRequestId(apiError("INVALID_REQUEST", "Invalid request payload.", 400), requestId);
    }

    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifyIdToken(parsed.data.idToken, true);

    let role: string = "TEACHER";
    let schoolId: string | null = null;
    let name: string = decoded.name || "Usuario";

    try {
      const doc = await getFirebaseAdminDb().collection("users").doc(decoded.uid).get();
      if (doc.exists) {
        const data = doc.data() || {};
        role = (data.role as string) || role;
        schoolId = (data.schoolId as string) || null;
        name = (data.name as string) || name;
      }
    } catch {
      // Do not block auth session creation on profile lookup.
    }

    await setSessionCookie(decoded.uid, role, schoolId || undefined);

    return withRequestId(apiSuccess({
      user: {
        id: decoded.uid,
        email: decoded.email || null,
        name,
        role,
        profile: { schoolId },
      },
    }), requestId);
  } catch (error: any) {
    logError(requestId, "Auth session error", { error: String(error) });
    return withRequestId(apiError("UNAUTHORIZED", "Invalid or expired Firebase token.", 401), requestId);
  }
}
