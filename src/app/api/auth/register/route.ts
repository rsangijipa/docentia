import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { UserService } from "@/services/userService";
import { login as setSessionCookie } from "@/lib/auth-service";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role, schoolId } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

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
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
