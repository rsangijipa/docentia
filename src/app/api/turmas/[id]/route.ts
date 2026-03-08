import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { TurmaService } from '@/services/turmaService';
import { turmaPatchSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';

async function getOwnedTurma(id: string, teacherId: string) {
  const turma = await TurmaService.getById(id);
  if (!turma) return { turma: null, error: apiError('NOT_FOUND', 'Turma nao encontrada', 404) };
  if (turma.teacherId !== teacherId) {
    return { turma: null, error: apiError('FORBIDDEN', 'Sem permissao para esta turma', 403) };
  }
  return { turma, error: null };
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

    await TurmaService.delete(params.id);
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

    const updated = await TurmaService.update(params.id, parsed.data);
    return apiSuccess({ turma: updated });
  } catch (error) {
    console.error('Error updating turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao atualizar turma', 500);
  }
}
