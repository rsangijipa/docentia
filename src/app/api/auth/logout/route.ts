import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { logout as destroySessionCookie } from "@/lib/auth-service";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
    await destroySessionCookie();
    return apiSuccess({ loggedOut: true });
}
