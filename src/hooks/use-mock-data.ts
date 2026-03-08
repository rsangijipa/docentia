import * as mocks from '@/mocks';

export function useMockData() {
    return {
        professor: mocks.mockProfessor,
        schools: mocks.mockSchools,
        turmas: mocks.mockTurmas,
        alunos: mocks.mockAlunos,
        calendar: mocks.mockCalendar,
        coursePlans: mocks.mockCoursePlans,
        lessonPlans: mocks.mockLessonPlans,
        diaryEntries: mocks.mockDiaryEntries,
        projects: mocks.mockProjects,
        notifications: mocks.mockNotifications,
        textbooks: mocks.mockTextbooks,
        templates: mocks.mockTemplates,
        inconsistencies: mocks.mockInconsistencias,
        recommendations: mocks.mockRecomendacoes,
        exports: mocks.mockExportacoes,
        bncc: mockBNCCData(),
    };
}

function mockBNCCData() {
    return mocks.mockBNCC;
}
