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
    const enabled = process.env.DEV_LOGIN_ENABLED === "true";
    const isDev = process.env.NODE_ENV === "development";
    if (!enabled || !isDev) {
      return withRequestId(
        apiError("FORBIDDEN", "Dev login is disabled for this environment.", 403),
        requestId
      );
    }

    const ip = getRequesterIp(req);
    const rl = hitRateLimit(`auth-dev-login:${ip}`, 20, 60_000);
    if (rl.limited) {
      return withRequestId(apiError("RATE_LIMITED", "Too many requests. Try again shortly.", 429), requestId);
    }

    const parsed = devLoginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return withRequestId(apiError("INVALID_REQUEST", "Invalid request payload.", 400), requestId);
    }

    const testEmail = process.env.TEST_LOGIN_EMAIL || "admin@admin.com";
    const testPass = process.env.TEST_LOGIN_PASSWORD || "1234567890";
    const testUserId = process.env.TEST_LOGIN_USER_ID || "test-admin";
    const testName = process.env.TEST_LOGIN_NAME || "Administrador de Teste";
    const testRole = process.env.TEST_LOGIN_ROLE || "ADMIN";

    const email = parsed.data.email.toLowerCase();
    const expectedEmail = testEmail.toLowerCase();

    if (email !== expectedEmail || parsed.data.pass !== testPass) {
      return withRequestId(apiError("UNAUTHORIZED", "Invalid credentials.", 401), requestId);
    }

    await setSessionCookie(testUserId, testRole, undefined);

    return withRequestId(apiSuccess({
      user: {
        id: testUserId,
        email: testEmail,
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
