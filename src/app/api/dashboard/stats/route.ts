export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from '@/lib/auth-service';
import { DashboardService } from '@/services/dashboardService';
import { apiError, apiSuccess } from '@/lib/api-response';

export async function GET() {
    const session = await getSession();

    if (!session || !session.userId) {
        return apiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    try {
        const stats = await DashboardService.getStats(session.userId);
        const agenda = await DashboardService.getDailyAgenda(session.userId);

        return apiSuccess({
            stats,
            agenda
        });
    } catch (error: any) {
        console.error('Dashboard data error:', error);
        return apiError('INTERNAL_ERROR', 'Failed to fetch dashboard data', 500);
    }
}
