import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt, SESSION_NAME } from "@/lib/session-token";

export interface SessionPayload {
    userId: string;
    role: string;
    schoolId?: string;
    expires: Date;
}

export async function login(userId: string, role: string, schoolId?: string) {
    // Create the session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, role, schoolId, expires });

    // Save the session in a cookie
    cookies().set(SESSION_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });
}

export async function logout() {
    // Destroy the session
    cookies().set(SESSION_NAME, "", { expires: new Date(0), path: "/" });
}

export async function getSession() {
    const session = cookies().get(SESSION_NAME)?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(SESSION_NAME)?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: SESSION_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
        path: "/"
    });
    return res;
}
