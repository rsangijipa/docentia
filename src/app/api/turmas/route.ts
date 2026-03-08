import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { turmaCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess, withRequestId } from '@/lib/api-response';
import { createClassroom, getTeacherClassrooms } from '@/services/firebase/admin-data';
import { getRequestId, logError } from '@/lib/request-trace';

export async function GET() {
  const requestId = getRequestId();
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const turmas = await getTeacherClassrooms(session.userId as string);
    return withRequestId(apiSuccess({ turmas }), requestId);
  } catch (error) {
    logError(requestId, 'Error fetching turmas', { error: String(error) });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao buscar turmas', 500), requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const session = await getSession();
  if (!session?.userId) {
    return withRequestId(apiError('UNAUTHORIZED', 'Nao autorizado', 401), requestId);
  }

  try {
    const parsed = turmaCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withRequestId(apiError('INVALID_REQUEST', 'Payload invalido para criacao de turma', 400), requestId);
    }

    const { nome, serie, turno, schoolId, subjectId } = parsed.data;
    const newTurma = await createClassroom({
      nome,
      serie,
      turno: turno || 'matutino',
      teacherId: session.userId as string,
      schoolId: schoolId || null,
      subjectId: subjectId || null,
    });

    return withRequestId(apiSuccess({ turma: newTurma }, 201), requestId);
  } catch (error) {
    logError(requestId, 'Error creating turma', { error: String(error) });
    return withRequestId(apiError('INTERNAL_ERROR', 'Erro ao criar turma', 500), requestId);
  }
}
