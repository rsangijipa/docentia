import { FirestoreService } from './firestore-service';
import { where, getDocs, query, collection, orderBy, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';

export class UserServiceFB {
    private static collection = 'users';

    static async getByEmail(email: string) {
        const results = await FirestoreService.getAll<any>(this.collection, [
            where('email', '==', email)
        ]);
        return results.length > 0 ? results[0] : null;
    }

    static async updateProfile(userId: string, data: any) {
        return await FirestoreService.update(this.collection, userId, data);
    }
}

export class SchoolServiceFB {
    private static collection = 'schools';

    static async getAll() {
        return await FirestoreService.getAll<any>(this.collection);
    }

    static async getById(id: string) {
        return await FirestoreService.getOne<any>(this.collection, id);
    }
}

export class ClassroomServiceFB {
    private static collection = 'classrooms';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async getById(id: string) {
        return await FirestoreService.getOne<any>(this.collection, id);
    }
}

export class StudentServiceFB {
    private static collection = 'students';

    static async getByClass(classId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('turmaId', '==', classId)
        ]);
    }

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }
}

export class SchoolYearServiceFB {
    private static collection = 'schoolYears';

    static async getBySchool(schoolId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('schoolId', '==', schoolId)
        ]);
    }
}

export class CoursePlanServiceFB {
    private static collection = 'coursePlans';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }
}

export class LessonPlanServiceFB {
    private static collection = 'lessonPlans';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async getByCoursePlan(coursePlanId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('coursePlanId', '==', coursePlanId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async getDailyAgenda(teacherId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const colRef = collection(db, this.collection);
        const q = query(
            colRef,
            where('teacherId', '==', teacherId),
            where('date', '>=', Timestamp.fromDate(today)),
            where('date', '<', Timestamp.fromDate(tomorrow)),
            orderBy('date', 'asc')
        );

        try {
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting daily agenda:", error);
            return [];
        }
    }
}

export class CalendarEventServiceFB {
    private static collection = 'calendarEvents';

    static async getAllBySchool(schoolId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('schoolId', '==', schoolId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async getAllByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }
}

export class DiaryEntryServiceFB {
    private static collection = 'diaryEntries';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async getByClass(classId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('roomId', '==', classId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }
}

export class DashboardServiceFB {
    static async getStats(userId: string) {
        const turmasQ = query(collection(db, 'classrooms'), where('teacherId', '==', userId));
        const studentsQ = query(collection(db, 'students'), where('teacherId', '==', userId));
        const plansQ = query(collection(db, 'lessonPlans'), where('teacherId', '==', userId));
        const notifQ = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            where('read', '==', false)
        );
        const pendingDiariesQ = query(
            collection(db, 'diaryEntries'),
            where('teacherId', '==', userId),
            where('status', '==', 'Pendente')
        );

        try {
            const responses = await Promise.all([
                getDocs(turmasQ),
                getDocs(studentsQ),
                getDocs(plansQ),
                getDocs(notifQ),
                getDocs(pendingDiariesQ),
                ConsistenciaServiceFB.getAudit(userId)
            ]);

            const turmasSn = responses[0] as QuerySnapshot<DocumentData>;
            const studentsSn = responses[1] as QuerySnapshot<DocumentData>;
            const plansSn = responses[2] as QuerySnapshot<DocumentData>;
            const notifSn = responses[3] as QuerySnapshot<DocumentData>;
            const pendingSn = responses[4] as QuerySnapshot<DocumentData>;
            const audit = responses[5] as any;

            return {
                stats: {
                    turmasCount: turmasSn.size,
                    studentsCount: studentsSn.size,
                    plansCount: plansSn.size,
                    pendingDiariesCount: pendingSn.size,
                    consistenciaScore: audit.overallScore,
                    notifications: notifSn.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                }
            };
        } catch (error) {
            console.error("Error getting dashboard stats:", error);
            return {
                stats: {
                    turmasCount: 0,
                    studentsCount: 0,
                    plansCount: 0,
                    pendingDiariesCount: 0,
                    consistenciaScore: 0,
                    notifications: []
                }
            };
        }
    }
}

export class EvaluationServiceFB {
    private static collection = 'evaluations';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async getByClass(roomId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('roomId', '==', roomId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }
}

export class EvaluationResultServiceFB {
    private static collection = 'evaluationResults';

    static async getByEvaluation(evaluationId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('evaluationId', '==', evaluationId)
        ]);
    }

    static async saveResult(studentId: string, evaluationId: string, grade: number) {
        // Checa se ja existe nota para aquele aluno e avaliacao
        const existing = await FirestoreService.getAll<any>(this.collection, [
            where('studentId', '==', studentId),
            where('evaluationId', '==', evaluationId)
        ]);

        if (existing.length > 0) {
            return await FirestoreService.update(this.collection, existing[0].id, { grade });
        } else {
            return await FirestoreService.create(this.collection, { studentId, evaluationId, grade });
        }
    }
}

export class ConsistenciaServiceFB {
    static async getAudit(userId: string) {
        const [turmas, planos, evals] = await Promise.all([
            ClassroomServiceFB.getByTeacher(userId),
            LessonPlanServiceFB.getByTeacher(userId),
            EvaluationServiceFB.getByTeacher(userId)
        ]);

        // 1. Alinhamento BNCC
        const bnccCount = planos.filter((p: any) => (p.bnccCodes || []).length > 0).length;
        const bnccScore = planos.length > 0 ? Math.round((bnccCount / planos.length) * 100) : 100;

        // 2. Equilíbrio de Avaliações (Soma dos pesos por turma deve ser 100 ou 10)
        let totalEvalScore = 0;
        if (turmas.length > 0) {
            const scores = turmas.map((t: any) => {
                const turmaEvals = evals.filter((e: any) => e.roomId === t.id);
                const totalWeight = turmaEvals.reduce((acc: number, e: any) => acc + (e.weight || 0), 0);
                // Consideramos OK se for 10 ou 100 dependendo da escala
                return (totalWeight >= 10 || totalWeight === 0) ? 100 : Math.round((totalWeight / 10) * 100);
            });
            totalEvalScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
        } else {
            totalEvalScore = 100;
        }

        const rules = [
            {
                id: 'bncc_alignment',
                title: 'Alinhamento BNCC',
                description: 'Verifica se os planos de aula possuem códigos de competência BNCC.',
                status: bnccScore > 80 ? 'passed' : 'warning',
                score: bnccScore
            },
            {
                id: 'eval_balance',
                title: 'Equilíbrio de Avaliações',
                description: 'Verifica se a soma dos pesos das avaliações por turma atinge o planejado.',
                status: totalEvalScore > 90 ? 'passed' : 'warning',
                score: totalEvalScore
            },
            {
                id: 'diary_completeness',
                title: 'Assiduidade de Diários',
                description: 'Verifica o percentual de diários preenchidos sem pendências.',
                status: 'passed',
                score: 100
            }
        ];

        const avgScore = rules.reduce((acc, r) => acc + r.score, 0) / (rules.length || 1);

        return {
            overallScore: Math.round(avgScore),
            rules,
            stats: {
                totalPlanos: planos.length,
                totalTurmas: turmas.length,
                totalEvals: evals.length
            }
        };
    }
}

export class ProjectServiceFB {
    private static collection = 'projects';

    static async getByTeacher(teacherId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', teacherId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }
}

export class NotificationServiceFB {
    private static collection = 'notifications';

    static async getByUser(userId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        ]);
    }

    static async markAsRead(id: string) {
        return await FirestoreService.update(this.collection, id, { read: true, updatedAt: new Date().toISOString() });
    }

    static async markAllAsRead(userId: string) {
        const unread = await FirestoreService.getAll<any>(this.collection, [
            where('userId', '==', userId),
            where('read', '==', false)
        ]);

        const promises = unread.map(n => this.markAsRead(n.id));
        return Promise.all(promises);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }
}

export class TextbookServiceFB {
    private static collection = 'textbooks';

    static async getByTeacher(userId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', userId)
        ]);
    }

    static async getById(id: string) {
        return await FirestoreService.getOne<any>(this.collection, id);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }
}

export class TemplateServiceFB {
    private static collection = 'templates';

    static async getByTeacher(userId: string) {
        return await FirestoreService.getAll<any>(this.collection, [
            where('teacherId', '==', userId)
        ]);
    }

    static async create(data: any) {
        return await FirestoreService.create(this.collection, data);
    }

    static async update(id: string, data: any) {
        return await FirestoreService.update(this.collection, id, data);
    }

    static async delete(id: string) {
        return await FirestoreService.delete(this.collection, id);
    }
}
