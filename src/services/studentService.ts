import prisma from "@/lib/prisma";

export const StudentService = {
    async getAllByTurma(turmaId: string) {
        return await prisma.student.findMany({
            where: { turmaId },
            orderBy: { nome: 'asc' }
        });
    },

    async getAllByTeacher(teacherId: string) {
        return await prisma.student.findMany({
            where: {
                turma: {
                    teacherId: teacherId
                }
            },
            include: {
                turma: true
            },
            orderBy: { nome: 'asc' }
        });
    },

    async getById(id: string) {
        return await prisma.student.findUnique({
            where: { id }
        });
    },

    async create(data: {
        nome: string,
        matricula: string,
        turmaId: string,
        frequenciaGeral?: number,
        desempenhoGeral?: number,
        status?: string,
        observacoes?: string
    }) {
        return await prisma.student.create({
            data: {
                nome: data.nome,
                matricula: data.matricula,
                turmaId: data.turmaId,
                frequenciaGeral: data.frequenciaGeral ?? 0,
                desempenhoGeral: data.desempenhoGeral ?? 0,
                status: data.status ?? 'ativo',
                observacoes: data.observacoes,
            }
        });
    },

    async update(id: string, data: Partial<{
        nome: string,
        matricula: string,
        turmaId: string,
        status: string,
        observacoes: string
    }>) {
        return await prisma.student.update({
            where: { id },
            data
        });
    },

    async delete(id: string) {
        return await prisma.student.delete({
            where: { id }
        });
    }
};
