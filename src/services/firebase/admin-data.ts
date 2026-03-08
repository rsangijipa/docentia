import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";

const db = getFirebaseAdminDb();

function sanitizeString(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

export async function getTeacherClassrooms(teacherId: string) {
  const snapshot = await db
    .collection("classrooms")
    .where("teacherId", "==", teacherId)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getClassroomById(id: string) {
  const doc = await db.collection("classrooms").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createClassroom(params: {
  nome: string;
  serie: string;
  turno: string;
  teacherId: string;
  schoolId?: string | null;
  subjectId?: string | null;
}) {
  const payload = {
    nome: sanitizeString(params.nome),
    serie: sanitizeString(params.serie),
    turno: sanitizeString(params.turno, "matutino"),
    teacherId: params.teacherId,
    schoolId: params.schoolId || null,
    subjectId: params.subjectId || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const ref = await db.collection("classrooms").add(payload);
  return { id: ref.id, ...payload };
}

export async function updateClassroom(id: string, data: Record<string, unknown>) {
  await db.collection("classrooms").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return getClassroomById(id);
}

export async function deleteClassroom(id: string) {
  await db.collection("classrooms").doc(id).delete();
}

export async function getTeacherStudents(teacherId: string) {
  const snapshot = await db
    .collection("students")
    .where("teacherId", "==", teacherId)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getStudentsByClassroom(turmaId: string) {
  const snapshot = await db
    .collection("students")
    .where("turmaId", "==", turmaId)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getStudentById(id: string) {
  const doc = await db.collection("students").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function findStudentByMatricula(matricula: string) {
  const snapshot = await db
    .collection("students")
    .where("matricula", "==", matricula)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const first = snapshot.docs[0];
  return { id: first.id, ...first.data() };
}

export async function createStudent(params: {
  nome: string;
  matricula: string;
  turmaId: string;
  teacherId: string;
  frequenciaGeral?: number;
  desempenhoGeral?: number;
  status?: string;
  observacoes?: string;
}) {
  const payload = {
    nome: sanitizeString(params.nome),
    matricula: sanitizeString(params.matricula),
    turmaId: params.turmaId,
    teacherId: params.teacherId,
    frequenciaGeral: typeof params.frequenciaGeral === "number" ? params.frequenciaGeral : 0,
    desempenhoGeral: typeof params.desempenhoGeral === "number" ? params.desempenhoGeral : 0,
    status: sanitizeString(params.status, "ativo"),
    observacoes: sanitizeString(params.observacoes, ""),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const ref = await db.collection("students").add(payload);
  return { id: ref.id, ...payload };
}

export async function updateStudent(id: string, data: Record<string, unknown>) {
  await db.collection("students").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return getStudentById(id);
}

export async function deleteStudent(id: string) {
  await db.collection("students").doc(id).delete();
}

export async function getDashboardStats(teacherId: string) {
  const [classrooms, students, plans, notifications] = await Promise.all([
    db.collection("classrooms").where("teacherId", "==", teacherId).get(),
    db.collection("students").where("teacherId", "==", teacherId).get(),
    db.collection("lessonPlans").where("teacherId", "==", teacherId).get(),
    db
      .collection("notifications")
      .where("userId", "==", teacherId)
      .where("read", "==", false)
      .limit(10)
      .get(),
  ]);

  return {
    turmasCount: classrooms.size,
    studentsCount: students.size,
    plansCount: plans.size,
    pendingDiariesCount: 0,
    notifications: notifications.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
}

export async function getTeacherAgendaForToday(teacherId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const snapshot = await db
    .collection("lessonPlans")
    .where("teacherId", "==", teacherId)
    .where("date", ">=", Timestamp.fromDate(start))
    .where("date", "<", Timestamp.fromDate(end))
    .orderBy("date", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
