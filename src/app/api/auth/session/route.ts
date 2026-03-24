import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { authSessionSchema } from "@/lib/api-schemas";
import { apiError, apiSuccess, withRequestId } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase/admin";
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

    const { idToken: accessToken } = await req.json();
    if (!accessToken) {
      return withRequestId(apiError("INVALID_REQUEST", "Access token is required.", 400), requestId);
    }

    const { data: { user: supabaseUser }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !supabaseUser) {
      throw authError || new Error("User not found");
    }

    let role: string = supabaseUser.user_metadata?.role || "TEACHER";
    let schoolId: string | null = supabaseUser.user_metadata?.school_id || null;
    let name: string = supabaseUser.user_metadata?.name || "Usuario";

    // Attempt to enrich from profiles table if needed
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
        
      if (profile) {
        role = profile.role || role;
        schoolId = profile.school_id || schoolId;
        name = profile.name || name;
      }
    } catch {
      // Non-blocking profile lookup
    }

    await setSessionCookie(supabaseUser.id, role, schoolId || undefined);

    return withRequestId(apiSuccess({
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        name,
        role,
        profile: { schoolId },
      },
    }), requestId);
  } catch (error: any) {
    logError(requestId, "Auth session error - Verification Failed", { 
      error: String(error),
      message: error?.message,
      code: error?.code 
    });
    return withRequestId(apiError("UNAUTHORIZED", `Authentication failed: ${error?.message || 'Invalid or expired token.'}`, 401), requestId);
  }
}
