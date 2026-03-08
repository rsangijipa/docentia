import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { studentPatchSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';
import {
  deleteStudent,
  getClassroomById,
  getStudentById,
  updateStudent,
} from '@/services/firebase/admin-data';

async function getOwnedStudent(id: string, teacherId: string) {
  const student = await getStudentById(id);
  if (!student) {
    return { student: null, error: apiError('NOT_FOUND', 'Aluno nao encontrado', 404) };
  }
  const turmaId = student.turmaId as string | undefined;
  if (!turmaId) {
    return { student: null, error: apiError('FORBIDDEN', 'Aluno sem turma valida', 403) };
  }
  const turma = await getClassroomById(turmaId);
  if (!turma || (turma.teacherId as string) !== teacherId) {
    return { student: null, error: apiError('FORBIDDEN', 'Sem permissao para este aluno', 403) };
  }
  return { student, error: null };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const ownership = await getOwnedStudent(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    await deleteStudent(params.id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao excluir aluno', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const ownership = await getOwnedStudent(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    const parsed = studentPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError('INVALID_REQUEST', 'Payload invalido para atualizacao de aluno', 400);
    }

    const updated = await updateStudent(params.id, parsed.data);
    return apiSuccess({ student: updated });
  } catch (error) {
    console.error('Error updating student:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao atualizar aluno', 500);
  }
}
