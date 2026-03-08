export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { hashPassword } from "@/lib/password";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";

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
    const db = getFirebaseAdminDb();
    const hashedPassword = await hashPassword("1234567890");

    const schoolRef = db.collection('schools').doc('esc-1');
    await schoolRef.set({
      id: "esc-1",
      name: "Escola Municipal Monteiro Lobato",
      address: "Rua das Flores, 123 - Centro",
      type: "municipal",
      logo: "EM",
      color: "indigo",
    }, { merge: true });

    const adminRef = db.collection('users').doc('prof-admin');
    await adminRef.set({
      id: "prof-admin",
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Administrador Docentia",
      role: "ADMIN",
      schoolId: schoolRef.id,
      specialty: "Gestão Pedagógica"
    }, { merge: true });

    const yearRef = db.collection('schoolYears').doc('year-2026');
    await yearRef.set({
      id: "year-2026",
      name: "Ano Letivo 2026",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-12-15"),
      active: true,
      schoolId: schoolRef.id,
    }, { merge: true });

    const subjectRef = db.collection('subjects').doc('subject-matematica');
    await subjectRef.set({
      id: "subject-matematica",
      name: "Matemática",
      schoolId: schoolRef.id,
    }, { merge: true });

    const turmaRef = db.collection('classrooms').doc('turma-8a');
    await turmaRef.set({
      id: "turma-8a",
      nome: "8º Ano A",
      serie: "8º Ano",
      turno: "matutino",
      schoolId: schoolRef.id,
      subjectId: subjectRef.id,
      teacherId: adminRef.id,
    }, { merge: true });

    const studentsData = [
      { nome: "Ana Beatriz Silva", matricula: "2026001" },
      { nome: "Bruno Oliveira", matricula: "2026002" },
      { nome: "Carla Souza", matricula: "2026003" },
      { nome: "Daniel Ferreira", matricula: "2026004" },
      { nome: "Eduarda Santos", matricula: "2026005" },
    ];

    for (const student of studentsData) {
      const studentRef = db.collection('students').doc(`student-${student.matricula}`);
      await studentRef.set({
        id: studentRef.id,
        nome: student.nome,
        matricula: student.matricula,
        turmaId: turmaRef.id,
        frequenciaGeral: 95,
        desempenhoGeral: 8.5,
      }, { merge: true });
    }

    return apiSuccess({
      seeded: true,
      schoolId: schoolRef.id,
      adminId: adminRef.id,
      schoolYearId: yearRef.id,
      subjectId: subjectRef.id,
      turmaId: turmaRef.id,
      students: studentsData.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return apiError("INTERNAL_ERROR", "Failed to seed debug data.", 500);
  }
}
