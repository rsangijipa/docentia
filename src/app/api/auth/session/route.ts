import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { authSessionSchema } from "@/lib/api-schemas";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase-admin";
import { login as setSessionCookie } from "@/lib/auth-service";
import { hitRateLimit } from "@/lib/rate-limit";

function getRequesterIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRequesterIp(req);
    const rl = hitRateLimit(`auth-session:${ip}`, 20, 60_000);
    if (rl.limited) {
      return apiError("RATE_LIMITED", "Too many requests. Try again shortly.", 429);
    }

    const parsed = authSessionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return apiError("INVALID_REQUEST", "Invalid request payload.", 400);
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

    return apiSuccess({
      user: {
        id: decoded.uid,
        email: decoded.email || null,
        name,
        role,
        profile: { schoolId },
      },
    });
  } catch (error: any) {
    console.error("Auth session error:", error);
    return apiError("UNAUTHORIZED", "Invalid or expired Firebase token.", 401);
  }
}
