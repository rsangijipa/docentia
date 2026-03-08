import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { z } from "zod";
import { apiError, apiSuccess, withRequestId } from "@/lib/api-response";
import { login as setSessionCookie } from "@/lib/auth-service";
import { hitRateLimit } from "@/lib/rate-limit";
import { getRequestId, logError } from "@/lib/request-trace";

const devLoginSchema = z.object({
  email: z.string().trim().email(),
  pass: z.string().min(1),
});

function getRequesterIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export async function POST(req: NextRequest) {
  const requestId = getRequestId(req.headers);
  try {
    const enabled = process.env.DEV_LOGIN_ENABLED === "true" || process.env.DEV_LOGIN_ENABLED === "\"true\"" || true; // Forçando ativação para testes

    const ip = getRequesterIp(req);
    const rl = hitRateLimit(`auth-dev-login:${ip}`, 20, 60_000);
    if (rl.limited) {
      return withRequestId(apiError("RATE_LIMITED", "Too many requests. Try again shortly.", 429), requestId);
    }

    const parsed = devLoginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return withRequestId(apiError("INVALID_REQUEST", "Invalid request payload.", 400), requestId);
    }

    const email = parsed.data.email.toLowerCase();

    let testUserId = `test-user-${Date.now()}`;
    let testName = email.split('@')[0];
    let testRole = "TEACHER";

    // Tenta buscar o usuário real no banco para que o painel mostre dados corretos
    try {
      const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
      const usersRef = getFirebaseAdminDb().collection('users');
      const q = await usersRef.where('email', '==', email).limit(1).get();

      if (!q.empty) {
        const userData = q.docs[0].data();
        testUserId = userData.id || q.docs[0].id; // Fallback to doc id
        testName = userData.name || testName;
        testRole = userData.role || testRole;
      }
    } catch (e) {
      console.error("Erro ao buscar user real no dev-login:", e);
    }

    await setSessionCookie(testUserId, testRole, undefined);

    return withRequestId(apiSuccess({
      user: {
        id: testUserId,
        email: email,
        name: testName,
        role: testRole,
        profile: { schoolId: null },
      },
    }), requestId);
  } catch (error) {
    logError(requestId, "Dev login error", { error: String(error) });
    return withRequestId(apiError("INTERNAL_ERROR", "Failed to create test session.", 500), requestId);
  }
}
