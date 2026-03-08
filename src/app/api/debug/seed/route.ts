import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('1234567890', 10);

        // 1. Create School
        const school = await prisma.school.upsert({
            where: { id: 'esc-1' },
            update: {},
            create: {
                id: 'esc-1',
                name: 'Escola Municipal Monteiro Lobato',
                address: 'Rua das Flores, 123 - Centro',
                type: 'municipal',
                logo: 'EM',
                color: 'indigo',
            },
        });

        // 2. Create Admin User
        const admin = await prisma.user.upsert({
            where: { email: 'admin@admin.com' },
            update: {
                password: hashedPassword,
            },
            create: {
                id: 'prof-admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                name: 'Administrador Docentia',
                role: 'ADMIN',
                profile: {
                    create: {
                        schoolId: school.id,
                        specialty: 'Gestão Pedagógica',
                    },
                },
            },
        });

        // 3. Create School Year
        const year = await prisma.schoolYear.create({
            data: {
                name: 'Ano Letivo 2026',
                startDate: new Date('2026-02-01'),
                endDate: new Date('2026-12-15'),
                active: true,
                schoolId: school.id,
            }
        });

        // 4. Create Subject
        const math = await prisma.subject.create({
            data: {
                name: 'Matemática',
                schoolId: school.id,
            }
        });

        // 5. Create Class 8A
        const turma8A = await prisma.classRoom.create({
            data: {
                id: 'turma-8a',
                nome: '8º Ano A',
                serie: '8º Ano',
                turno: 'matutino',
                schoolId: school.id,
                subjectId: math.id,
                teacherId: admin.id,
            }
        });

        // 6. Create Students
        const studentsData = [
            { nome: 'Ana Beatriz Silva', matricula: '2026001' },
            { nome: 'Bruno Oliveira', matricula: '2026002' },
            { nome: 'Carla Souza', matricula: '2026003' },
            { nome: 'Daniel Ferreira', matricula: '2026004' },
            { nome: 'Eduarda Santos', matricula: '2026005' },
        ];

        for (const s of studentsData) {
            await prisma.student.upsert({
                where: { matricula: s.matricula },
                update: { turmaId: turma8A.id },
                create: {
                    nome: s.nome,
                    matricula: s.matricula,
                    turmaId: turma8A.id,
                    frequenciaGeral: 95,
                    desempenhoGeral: 8.5,
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Database seeded successfully' });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
