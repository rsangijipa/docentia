export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { apiError, apiSuccess } from "@/lib/api-response";

const DEBUG_SEED_KEY = process.env.DEBUG_SEED_KEY;

export async function POST(request: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const hasKeyConfigured = Boolean(DEBUG_SEED_KEY);
  const requestKey = request.headers.get("x-debug-seed-key");

  if (!isDev && !hasKeyConfigured) {
    return apiError("FORBIDDEN", "Seed endpoint is disabled in this environment.", 403);
  }

  if (hasKeyConfigured && requestKey !== DEBUG_SEED_KEY) {
    return apiError("FORBIDDEN", "Invalid debug seed key.", 403);
  }

  try {
    const hashedPassword = await hashPassword("1234567890");

    const school = await prisma.school.upsert({
      where: { id: "esc-1" },
      update: {},
      create: {
        id: "esc-1",
        name: "Escola Municipal Monteiro Lobato",
        address: "Rua das Flores, 123 - Centro",
        type: "municipal",
        logo: "EM",
        color: "indigo",
      },
    });

    const admin = await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {
        password: hashedPassword,
        name: "Administrador Docentia",
        role: "ADMIN",
      },
      create: {
        id: "prof-admin",
        email: "admin@admin.com",
        password: hashedPassword,
        name: "Administrador Docentia",
        role: "ADMIN",
      },
    });

    await prisma.profile.upsert({
      where: { userId: admin.id },
      update: {
        schoolId: school.id,
        specialty: "Gestao Pedagogica",
      },
      create: {
        userId: admin.id,
        schoolId: school.id,
        specialty: "Gestao Pedagogica",
      },
    });

    const schoolYear = await prisma.schoolYear.upsert({
      where: { id: "year-2026" },
      update: {
        name: "Ano Letivo 2026",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-12-15"),
        active: true,
        schoolId: school.id,
      },
      create: {
        id: "year-2026",
        name: "Ano Letivo 2026",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-12-15"),
        active: true,
        schoolId: school.id,
      },
    });

    const subject = await prisma.subject.upsert({
      where: { id: "subject-matematica" },
      update: {
        name: "Matematica",
        schoolId: school.id,
      },
      create: {
        id: "subject-matematica",
        name: "Matematica",
        schoolId: school.id,
      },
    });

    const turma8A = await prisma.classRoom.upsert({
      where: { id: "turma-8a" },
      update: {
        nome: "8o Ano A",
        serie: "8o Ano",
        turno: "matutino",
        schoolId: school.id,
        subjectId: subject.id,
        teacherId: admin.id,
      },
      create: {
        id: "turma-8a",
        nome: "8o Ano A",
        serie: "8o Ano",
        turno: "matutino",
        schoolId: school.id,
        subjectId: subject.id,
        teacherId: admin.id,
      },
    });

    const studentsData = [
      { nome: "Ana Beatriz Silva", matricula: "2026001" },
      { nome: "Bruno Oliveira", matricula: "2026002" },
      { nome: "Carla Souza", matricula: "2026003" },
      { nome: "Daniel Ferreira", matricula: "2026004" },
      { nome: "Eduarda Santos", matricula: "2026005" },
    ];

    for (const student of studentsData) {
      await prisma.student.upsert({
        where: { matricula: student.matricula },
        update: {
          nome: student.nome,
          turmaId: turma8A.id,
          frequenciaGeral: 95,
          desempenhoGeral: 8.5,
        },
        create: {
          nome: student.nome,
          matricula: student.matricula,
          turmaId: turma8A.id,
          frequenciaGeral: 95,
          desempenhoGeral: 8.5,
        },
      });
    }

    return apiSuccess({
      seeded: true,
      schoolId: school.id,
      adminId: admin.id,
      schoolYearId: schoolYear.id,
      subjectId: subject.id,
      turmaId: turma8A.id,
      students: studentsData.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return apiError("INTERNAL_ERROR", "Failed to seed debug data.", 500);
  }
}
