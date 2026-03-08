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

        try {
            const responses = await Promise.all([
                getDocs(turmasQ),
                getDocs(studentsQ),
                getDocs(plansQ),
                getDocs(notifQ)
            ]);

            const turmasSn = responses[0] as QuerySnapshot<DocumentData>;
            const studentsSn = responses[1] as QuerySnapshot<DocumentData>;
            const plansSn = responses[2] as QuerySnapshot<DocumentData>;
            const notifSn = responses[3] as QuerySnapshot<DocumentData>;

            return {
                stats: {
                    turmasCount: turmasSn.size,
                    studentsCount: studentsSn.size,
                    plansCount: plansSn.size,
                    pendingDiariesCount: 0,
                    notifications: notifSn.docs.map(d => ({ id: d.id, ...d.data() }))
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
                    notifications: []
                }
            };
        }
    }
}
