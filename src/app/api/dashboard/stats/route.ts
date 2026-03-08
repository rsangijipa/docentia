export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from '@/lib/auth-service';
import { apiError, apiSuccess } from '@/lib/api-response';
import { getDashboardStats, getTeacherAgendaForToday } from '@/services/firebase/admin-data';

export async function GET() {
    const session = await getSession();

    if (!session || !session.userId) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    try {
        const stats = await getDashboardStats(session.userId as string);
        const agenda = await getTeacherAgendaForToday(session.userId as string);

        return apiSuccess({
            stats,
            agenda
        });
    } catch (error: any) {
        console.error('Dashboard data error:', error);
        return apiError('INTERNAL_ERROR', 'Failed to fetch dashboard data', 500);
    }
}
