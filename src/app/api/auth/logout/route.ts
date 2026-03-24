import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { logout as destroySessionCookie } from "@/lib/auth-service";
import { apiSuccess, withRequestId } from "@/lib/api-response";
import { hitRateLimit } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-trace";

function getRequesterIp(req: NextRequest) {
    const fwd = req.headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
    return "unknown";
}

export async function POST(req: NextRequest) {
    const requestId = getRequestId(req.headers);
    const ip = getRequesterIp(req);
    const rl = hitRateLimit(`auth-logout:${ip}`, 20, 60_000);
    
    await destroySessionCookie();
    return withRequestId(apiSuccess({ loggedOut: true }), requestId);
}
