import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from "@/lib/auth-service";

export async function GET() {
    const session = await getSession();

    if (!session || !session.userId) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
        const { UserService } = await import("@/services/userService");
        const user = await UserService.findUserById(session.userId);
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                profile: user.profile
            }
        });

    } catch (error: any) {
        console.error("Session check error:", error);
        return NextResponse.json({
            user: {
                id: session.userId,
                email: null,
                name: "Usuario",
                role: (session.role as string) || "TEACHER",
                profile: { schoolId: (session.schoolId as string) || null }
            }
        }, { status: 200 });
    }
}
