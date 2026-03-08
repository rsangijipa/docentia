import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { StudentService } from '@/services/studentService';
import prisma from '@/lib/prisma';
import { studentCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  const { searchParams } = new URL(request.url);
  const turmaId = searchParams.get('turmaId');

  try {
    if (turmaId) {
      const turma = await prisma.classRoom.findUnique({ where: { id: turmaId } });
      if (!turma) {
        return apiError('NOT_FOUND', 'Turma nao encontrada', 404);
      }
      if (turma.teacherId !== session.userId) {
        return apiError('FORBIDDEN', 'Sem permissao para visualizar alunos desta turma', 403);
      }

      const students = await StudentService.getAllByTurma(turmaId);
      return apiSuccess({ students });
    }

    const students = await StudentService.getAllByTeacher(session.userId as string);
    return apiSuccess({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao buscar alunos', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  try {
    const parsed = studentCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError('INVALID_REQUEST', 'Payload invalido para criacao de aluno', 400);
    }

    const turma = await prisma.classRoom.findUnique({ where: { id: parsed.data.turmaId } });
    if (!turma) {
      return apiError('NOT_FOUND', 'Turma nao encontrada', 404);
    }
    if (turma.teacherId !== session.userId) {
      return apiError('FORBIDDEN', 'Sem permissao para cadastrar aluno nesta turma', 403);
    }

    const newStudent = await StudentService.create(parsed.data);
    return apiSuccess({ student: newStudent }, 201);
  } catch (error: any) {
    console.error('Error creating student:', error);
    if (error?.code === 'P2002') {
      return apiError('INVALID_REQUEST', 'Matricula ja cadastrada', 409);
    }
    return apiError('INTERNAL_ERROR', 'Erro ao criar aluno', 500);
  }
}
