import prisma from '@/lib/prisma';

export class DashboardService {
    static async getStats(userId: string) {
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

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

        const lessonCandidates = await prisma.lessonPlan.findMany({
            where: {
                teacherId: userId,
                date: { lte: todayEnd },
            },
            select: {
                date: true,
                coursePlan: {
                    select: {
                        roomId: true,
                    },
                },
            },
        });

        const pendingChecks = await Promise.all(
            lessonCandidates.map(async (lesson) => {
                const roomId = lesson.coursePlan?.roomId;
                if (!roomId) return false;

                const start = new Date(lesson.date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(start.getDate() + 1);

                const diary = await prisma.classDiaryEntry.findFirst({
                    where: {
                        roomId,
                        date: { gte: start, lt: end },
                    },
                    select: { id: true },
                });

                return !diary;
            })
        );

        const pendingDiariesCount = pendingChecks.filter(Boolean).length;

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
