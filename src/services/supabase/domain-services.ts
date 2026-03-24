import { SupabaseService } from './supabase-service';
import { supabase } from '@/lib/supabase/client';

export class UserService extends SupabaseService<any> {
    constructor() {
        super('profiles');
    }

    async getByEmail(email: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') this.handleError(error);
        return data;
    }

    async updateProfile(userId: string, data: any) {
        return await this.update(userId, data);
    }
}

export class SchoolService extends SupabaseService<any> {
    constructor() {
        super('schools');
    }
}

export class ClassroomService extends SupabaseService<any> {
    constructor() {
        super('classrooms');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class StudentService extends SupabaseService<any> {
    constructor() {
        super('students');
    }

    async getByClass(classId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('classroom_id', classId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class CoursePlanService extends SupabaseService<any> {
    constructor() {
        super('course_plans');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class LessonPlanService extends SupabaseService<any> {
    constructor() {
        super('lesson_plans');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getByCoursePlan(coursePlanId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('course_plan_id', coursePlanId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getDailyAgenda(teacherId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId)
            .gte('date', today.toISOString())
            .lt('date', tomorrow.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.error("Error getting daily agenda:", error);
            return [];
        }
        return data || [];
    }
}

export class DiaryEntryService extends SupabaseService<any> {
    constructor() {
        super('diary_entries');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getByClass(classId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('classroom_id', classId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class EvaluationService extends SupabaseService<any> {
    constructor() {
        super('evaluations');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getByClass(classId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('classroom_id', classId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class EvaluationResultService extends SupabaseService<any> {
    constructor() {
        super('evaluation_results');
    }

    async getByEvaluation(evaluationId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('evaluation_id', evaluationId);
        if (error) this.handleError(error);
        return data || [];
    }

    async saveResult(studentId: string, evaluationId: string, grade: number, teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .upsert({
                student_id: studentId,
                evaluation_id: evaluationId,
                grade: grade,
                teacher_id: teacherId,
                updated_at: new Date().toISOString()
            }, { onConflict: 'evaluation_id,student_id' })
            .select()
            .single();

        if (error) this.handleError(error);
        return data;
    }
}

export class DashboardService {
    static async getStats(userId: string) {
        try {
            const [
                { count: turmasCount },
                { count: studentsCount },
                { count: plansCount },
                { data: notifications },
                { count: pendingDiariesCount }
            ] = await Promise.all([
                supabase.from('classrooms').select('*', { count: 'exact', head: true }).eq('teacher_id', userId),
                supabase.from('students').select('*', { count: 'exact', head: true }).eq('teacher_id', userId),
                supabase.from('lesson_plans').select('*', { count: 'exact', head: true }).eq('teacher_id', userId),
                supabase.from('notifications').select('*').eq('user_id', userId).eq('is_read', false),
                supabase.from('diary_entries').select('*', { count: 'exact', head: true }).eq('teacher_id', userId).eq('status', 'Pendente')
            ]);

            return {
                stats: {
                    turmasCount: turmasCount || 0,
                    studentsCount: studentsCount || 0,
                    plansCount: plansCount || 0,
                    pendingDiariesCount: pendingDiariesCount || 0,
                    consistenciaScore: 100, // Placeholder for now
                    notifications: notifications || []
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

export class ProjectService extends SupabaseService<any> {
    constructor() {
        super('projects');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class NotificationService extends SupabaseService<any> {
    constructor() {
        super('notifications');
    }

    async getByUser(userId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) this.handleError(error);
        return data || [];
    }

    async markAsRead(id: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .update({ is_read: true })
            .eq('id', id);
        if (error) this.handleError(error);
        return data;
    }

    async markAllAsRead(userId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);
        if (error) this.handleError(error);
        return data;
    }
}

export class TextbookService extends SupabaseService<any> {
    constructor() {
        super('textbooks');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class TemplateService extends SupabaseService<any> {
    constructor() {
        super('templates');
    }

    async getByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }
}

export class ConsistenciaService extends SupabaseService<any> {
    constructor() {
        super('profiles'); // Audits profiles and related data
    }

    async getAudit(userId: string) {
        // Mock implementation of audit logic for Supabase transition
        return {
            overallScore: 88,
            rules: [
                { id: 1, title: 'Cobertura BNCC', description: 'Planos vinculados a competências.', score: 95, status: 'passed' },
                { id: 2, title: 'Frequência Diária', description: 'Diários preenchidos nos últimos 7 dias.', score: 100, status: 'passed' },
                { id: 3, title: 'Mapas de Notas', description: 'Avaliações com resultados lançados.', score: 70, status: 'warning' },
                { id: 4, title: 'Planejamento Antecipado', description: 'Roteiros de aula para a próxima semana.', score: 85, status: 'passed' }
            ]
        };
    }
}

export class CalendarEventService extends SupabaseService<any> {
    constructor() {
        super('calendar_events');
    }

    async getAllByTeacher(teacherId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('teacher_id', teacherId);
        if (error) this.handleError(error);
        return data || [];
    }

    async getAllBySchool(schoolId: string) {
        const { data, error } = await supabase
            .from(this.collection)
            .select('*')
            .eq('school_id', schoolId);
        if (error) this.handleError(error);
        return data || [];
    }
}

// Export instances
export const userService = new UserService();
export const schoolService = new SchoolService();
export const classroomService = new ClassroomService();
export const studentService = new StudentService();
export const coursePlanService = new CoursePlanService();
export const lessonPlanService = new LessonPlanService();
export const diaryEntryService = new DiaryEntryService();
export const evaluationService = new EvaluationService();
export const evaluationResultService = new EvaluationResultService();
export const projectService = new ProjectService();
export const notificationService = new NotificationService();
export const textbookService = new TextbookService();
export const templateService = new TemplateService();
export const consistenciaService = new ConsistenciaService();
export const calendarEventService = new CalendarEventService();
