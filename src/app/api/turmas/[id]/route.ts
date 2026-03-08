import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { turmaPatchSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess, withRequestId } from '@/lib/api-response';
import { deleteClassroom, getClassroomById, updateClassroom } from '@/services/firebase/admin-data';
import { getRequestId, logError } from '@/lib/request-trace';

async function getOwnedTurma(id: string, teacherId: string) {
  const turma = (await getClassroomById(id)) as Record<string, unknown> | null;
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
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;
    return withRequestId(apiSuccess({ turma: ownership.turma }), requestId);
  } catch (error) {
    logError(requestId, 'Error fetching turma', { error: String(error), turmaId: params.id });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao buscar turma', 500), requestId);
  }
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
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    await deleteClassroom(params.id);
    return withRequestId(apiSuccess({ deleted: true }), requestId);
  } catch (error) {
    logError(requestId, 'Error deleting turma', { error: String(error), turmaId: params.id });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao excluir turma', 500), requestId);
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
    const ownership = await getOwnedTurma(params.id, session.userId as string);
    if (ownership.error) return ownership.error;

    const parsed = turmaPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withRequestId(apiError('INVALID_REQUEST', 'Payload invalido para atualizacao de turma', 400), requestId);
    }

    const updated = await updateClassroom(params.id, parsed.data);
    return withRequestId(apiSuccess({ turma: updated }), requestId);
  } catch (error) {
    logError(requestId, 'Error updating turma', { error: String(error), turmaId: params.id });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao atualizar turma', 500), requestId);
  }
}
