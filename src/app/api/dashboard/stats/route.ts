import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { getSession } from '@/lib/auth-service';
import { DashboardService } from '@/services/dashboardService';

export async function GET() {
    const session = await getSession();

    if (!session || !session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const stats = await DashboardService.getStats(session.userId);
        const agenda = await DashboardService.getDailyAgenda(session.userId);

        return NextResponse.json({
            success: true,
            stats,
            agenda
        });
    } catch (error: any) {
        console.error('Dashboard data error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
