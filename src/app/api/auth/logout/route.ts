import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { logout as destroySessionCookie } from "@/lib/auth-service";

export async function POST() {
    await destroySessionCookie();
    return NextResponse.json({ success: true });
}
