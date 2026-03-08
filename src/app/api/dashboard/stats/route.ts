export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from '@/lib/auth-service';
import { apiError, apiSuccess, withRequestId } from '@/lib/api-response';
import { getDashboardStats, getTeacherAgendaForToday } from '@/services/firebase/admin-data';
import { getRequestId, logError } from '@/lib/request-trace';

export async function GET(request: Request) {
    const requestId = getRequestId(request.headers);
    const session = await getSession();

    if (!session || !session.userId) {
        return withRequestId(apiError('UNAUTHORIZED', 'Unauthorized', 401), requestId);
    }

    try {
        const stats = await getDashboardStats(session.userId as string);
        const agenda = await getTeacherAgendaForToday(session.userId as string);

        return withRequestId(apiSuccess({
            stats,
            agenda
        }), requestId);
    } catch (error: any) {
        logError(requestId, 'Dashboard data error', { error: String(error) });
        return withRequestId(apiError('INTERNAL_ERROR', 'Failed to fetch dashboard data', 500), requestId);
    }
}
