import prisma from "@/lib/prisma";

export const TurmaService = {
    async getAllByTeacher(teacherId: string) {
        return await prisma.classRoom.findMany({
            where: { teacherId },
            include: {
                alunos: true,
                school: true,
                subject: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getById(id: string) {
        return await prisma.classRoom.findUnique({
            where: { id },
            include: {
                alunos: true,
                school: true,
                subject: true,
            }
        });
    },

    async create(data: {
        nome: string,
        serie: string,
        turno: string,
        teacherId: string,
        schoolId: string,
        subjectId: string
    }) {
        return await prisma.classRoom.create({
            data: {
                nome: data.nome,
                serie: data.serie,
                turno: data.turno,
                teacherId: data.teacherId,
                schoolId: data.schoolId,
                subjectId: data.subjectId,
            }
        });
    },

    async update(id: string, data: Partial<{ nome: string, serie: string, turno: string }>) {
        return await prisma.classRoom.update({
            where: { id },
            data
        });
    },

    async delete(id: string) {
        return await prisma.classRoom.delete({
            where: { id }
        });
    }
};
