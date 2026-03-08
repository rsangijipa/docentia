import prisma from '@/lib/prisma';

export class DashboardService {
    static async getStats(userId: string) {
        const [turmasCount, studentsCount, plansCount, notifications] = await Promise.all([
            prisma.classRoom.count({ where: { teacherId: userId } }),
            prisma.student.count({ where: { turma: { teacherId: userId } } }),
            prisma.lessonPlan.count({ where: { teacherId: userId } }),
            prisma.notification.findMany({
                where: { userId, read: false },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ]);

        // Pending diaries logic (mocking count for now but querying)
        const pendingDiariesCount = 3; // TODO: Implement real logic based on last lesson vs diary entry

        return {
            turmasCount,
            studentsCount,
            plansCount,
            pendingDiariesCount,
            notifications
        };
    }

    static async getDailyAgenda(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return await prisma.lessonPlan.findMany({
            where: {
                teacherId: userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                coursePlan: {
                    include: {
                        room: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
    }
}
