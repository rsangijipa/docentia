import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from "@/lib/auth-service";
import { apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getSession();
  if (!session || !session.userId) {
    return apiSuccess({ user: null });
  }

  let email: string | null = null;
  let name = "Usuario";
  let role = (session.role as string) || "TEACHER";
  let schoolId: string | null = (session.schoolId as string) || null;

  try {
    const { data: { user: supabaseUser }, error: authError } = await supabaseAdmin.auth.getUser(session.userId as string);
    if (!authError && supabaseUser) {
      email = supabaseUser.email || null;
      name = supabaseUser.user_metadata?.name || name;
    }
  } catch {
    // Keep session-only fallback.
  }

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', session.userId)
      .single();
      
    if (profile) {
      role = profile.role || role;
      schoolId = profile.school_id || schoolId;
      name = profile.name || name;
      email = profile.email || email;
    }
  } catch {
    // Keep session/user-auth fallback.
  }

  return apiSuccess({
    user: {
      id: session.userId,
      email,
      name,
      role,
      profile: { schoolId },
    },
  });
}
