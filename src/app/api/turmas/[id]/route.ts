import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { turmaPatchSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';
import { deleteClassroom, getClassroomById, updateClassroom } from '@/services/firebase/admin-data';

async function getOwnedTurma(id: string, teacherId: string) {
  const turma = await getClassroomById(id);
  if (!turma) return { turma: null, error: apiError('NOT_FOUND', 'Turma nao encontrada', 404) };
  if ((turma.teacherId as string) !== teacherId) {
    return { turma: null, error: apiError('FORBIDDEN', 'Sem permissao para esta turma', 403) };
  }
  return { turma, error: null };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;
    return apiSuccess({ turma: ownership.turma });
  } catch (error) {
    console.error('Error fetching turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao buscar turma', 500);
  }
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
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    await deleteClassroom(params.id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error('Error deleting turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao excluir turma', 500);
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
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    const parsed = turmaPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError('INVALID_REQUEST', 'Payload invalido para atualizacao de turma', 400);
    }

    const updated = await updateClassroom(params.id, parsed.data);
    return apiSuccess({ turma: updated });
  } catch (error) {
    console.error('Error updating turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao atualizar turma', 500);
  }
}
