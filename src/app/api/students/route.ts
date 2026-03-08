import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { studentCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess, withRequestId } from '@/lib/api-response';
import {
  createStudent,
  findStudentByMatricula,
  getClassroomById,
  getStudentsByClassroom,
  getTeacherStudents,
} from '@/services/firebase/admin-data';
import { getRequestId, logError } from '@/lib/request-trace';

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  const { searchParams } = new URL(request.url);
  const turmaId = searchParams.get('turmaId');

  try {
    if (turmaId) {
      const turma = (await getClassroomById(turmaId)) as Record<string, unknown> | null;
      if (!turma) {
        return withRequestId(apiError('NOT_FOUND', 'Turma nao encontrada', 404), requestId);
      }
      if ((turma.teacherId as string) !== session.userId) {
        return withRequestId(apiError('FORBIDDEN', 'Sem permissao para visualizar alunos desta turma', 403), requestId);
      }

      const students = await getStudentsByClassroom(turmaId);
      return withRequestId(apiSuccess({ students }), requestId);
    }

    const students = await getTeacherStudents(session.userId as string);
    return withRequestId(apiSuccess({ students }), requestId);
  } catch (error) {
    logError(requestId, 'Error fetching students', { error: String(error) });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao buscar alunos', 500), requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const parsed = studentCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withRequestId(apiError('INVALID_REQUEST', 'Payload invalido para criacao de aluno', 400), requestId);
    }

    const turma = (await getClassroomById(parsed.data.turmaId)) as Record<string, unknown> | null;
    if (!turma) {
      return withRequestId(apiError('NOT_FOUND', 'Turma nao encontrada', 404), requestId);
    }
    if ((turma.teacherId as string) !== session.userId) {
      return withRequestId(apiError('FORBIDDEN', 'Sem permissao para cadastrar aluno nesta turma', 403), requestId);
    }

    const matriculaExists = await findStudentByMatricula(parsed.data.matricula);
    if (matriculaExists) {
      return withRequestId(apiError('INVALID_REQUEST', 'Matricula ja cadastrada', 409), requestId);
    }

    const newStudent = await createStudent({
      ...parsed.data,
      teacherId: session.userId as string,
    });
    return withRequestId(apiSuccess({ student: newStudent }, 201), requestId);
  } catch (error) {
    logError(requestId, 'Error creating student', { error: String(error) });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao criar aluno', 500), requestId);
  }
}
