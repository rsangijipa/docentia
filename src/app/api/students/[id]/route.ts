import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { studentPatchSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess, withRequestId } from '@/lib/api-response';
import {
  deleteStudent,
  getClassroomById,
  getStudentById,
  updateStudent,
} from '@/services/firebase/admin-data';
import { getRequestId, logError } from '@/lib/request-trace';

async function getOwnedStudent(id: string, teacherId: string) {
  const student = (await getStudentById(id)) as Record<string, unknown> | null;
  if (!student) {
    return { student: null, error: apiError('NOT_FOUND', 'Aluno nao encontrado', 404) };
  }
  const turmaId = student.turmaId as string | undefined;
  if (!turmaId) {
    return { student: null, error: apiError('FORBIDDEN', 'Aluno sem turma valida', 403) };
  }
  const turma = (await getClassroomById(turmaId)) as Record<string, unknown> | null;
  if (!turma || (turma.teacherId as string) !== teacherId) {
    return { student: null, error: apiError('FORBIDDEN', 'Sem permissao para este aluno', 403) };
  }
  return { student, error: null };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const ownership = await getOwnedStudent(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    await deleteStudent(params.id);
    return withRequestId(apiSuccess({ deleted: true }), requestId);
  } catch (error) {
    logError(requestId, 'Error deleting student', { error: String(error), studentId: params.id });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao excluir aluno', 500), requestId);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const ownership = await getOwnedStudent(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    const parsed = studentPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withRequestId(apiError('INVALID_REQUEST', 'Payload invalido para atualizacao de aluno', 400), requestId);
    }

    const updated = await updateStudent(params.id, parsed.data);
    return withRequestId(apiSuccess({ student: updated }), requestId);
  } catch (error) {
    logError(requestId, 'Error updating student', { error: String(error), studentId: params.id });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao atualizar aluno', 500), requestId);
  }
}
