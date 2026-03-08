import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { login as setSessionCookie } from "@/lib/auth-service";
import { comparePassword } from "@/lib/password";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const { UserService } = await import("@/services/userService");
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Set the session cookie
        await setSessionCookie(user.id, user.role, user.profile?.schoolId || undefined);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error("Login error:", error);
        const message =
            error?.message ||
            "Failed to login. Check database configuration and server logs.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
