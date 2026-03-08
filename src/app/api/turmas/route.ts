import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { TurmaService } from '@/services/turmaService';
import prisma from '@/lib/prisma';
import { turmaCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const turmas = await TurmaService.getAllByTeacher(session.userId as string);
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

    // If schoolId or subjectId are not provided, try to find defaults for this user.
    let sId = schoolId;
    let subId = subjectId;

    if (!sId || !subId) {
      const userProfile = await prisma.profile.findUnique({
        where: { userId: session.userId as string },
        include: { school: { include: { subjects: true } } },
      });

      if (!sId) sId = userProfile?.schoolId || undefined;
      if (!subId) subId = userProfile?.school?.subjects[0]?.id;
    }

    if (!sId || !subId) {
      return apiError('INVALID_REQUEST', 'Escola ou disciplina nao encontradas para este usuario', 400);
    }

    const newTurma = await TurmaService.create({
      nome,
      serie,
      turno: turno || 'matutino',
      teacherId: session.userId as string,
      schoolId: sId,
      subjectId: subId,
    });

    return apiSuccess({ turma: newTurma }, 201);
  } catch (error) {
    console.error('Error creating turma:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao criar turma', 500);
  }
}
