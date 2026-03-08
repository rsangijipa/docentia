require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('1234567890', 10);

    // School
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

    // User
    const user = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
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

    // School Year
    const year = await prisma.schoolYear.create({
        data: {
            name: 'Ano Letivo 2026',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-12-15'),
            active: true,
            schoolId: school.id,
        }
    });

    // Subject
    const math = await prisma.subject.create({
        data: {
            name: 'Matemática',
            schoolId: school.id,
        }
    });

    // Class 8A
    const turma8A = await prisma.classRoom.create({
        data: {
            id: 'turma-8a',
            nome: '8º Ano A',
            serie: '8º Ano',
            turno: 'matutino',
            schoolId: school.id,
            subjectId: math.id,
            teacherId: user.id,
        }
    });

    // Students
    const students = [
        { nome: 'Ana Beatriz Silva', matricula: '2026001' },
        { nome: 'Bruno Oliveira', matricula: '2026002' },
        { nome: 'Carla Souza', matricula: '2026003' },
    ];

    for (const s of students) {
        await prisma.student.create({
            data: {
                nome: s.nome,
                matricula: s.matricula,
                turmaId: turma8A.id,
                frequenciaGeral: 95,
                desempenhoGeral: 8.5,
            }
        });
    }

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
