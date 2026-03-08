import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { turmaCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';
import { createClassroom, getTeacherClassrooms } from '@/services/firebase/admin-data';

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const turmas = await getTeacherClassrooms(session.userId as string);
    return apiSuccess({ turmas });
  } catch (error) {
    console.error('Error fetching turmas:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao buscar turmas', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const parsed = turmaCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError('INVALID_REQUEST', 'Payload invalido para criacao de turma', 400);
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

    return apiSuccess({ turma: newTurma }, 201);
  } catch (error) {
    console.error('Error creating turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao criar turma', 500);
  }
}
