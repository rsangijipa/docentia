import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { login as setSessionCookie } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role, schoolId } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { UserService } = await import("@/services/userService");
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        const user = await UserService.createUser({ name, email, password, role, schoolId });

        // Automatically set the session cookie
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
        console.error("Registration error:", error);
        const message =
            error?.message ||
            "Failed to register user. Check database configuration and server logs.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
