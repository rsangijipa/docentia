import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from "@/lib/auth-service";
import { apiSuccess } from "@/lib/api-response";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase-admin";

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
    const authUser = await getFirebaseAdminAuth().getUser(session.userId as string);
    email = authUser.email || null;
    name = authUser.displayName || name;
  } catch {
    // Keep session-only fallback.
  }

  try {
    const doc = await getFirebaseAdminDb().collection("users").doc(session.userId as string).get();
    if (doc.exists) {
      const data = doc.data() || {};
      role = (data.role as string) || role;
      schoolId = (data.schoolId as string) || schoolId;
      name = (data.name as string) || name;
      email = (data.email as string) || email;
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
