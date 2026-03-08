import { NextRequest, NextResponse } from "next/server";
import { logout as destroySessionCookie } from "@/lib/auth-service";

export async function POST() {
    await destroySessionCookie();
    return NextResponse.json({ success: true });
}
