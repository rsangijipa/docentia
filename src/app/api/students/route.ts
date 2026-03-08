import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getSession } from '@/lib/auth-service';
import { studentCreateSchema } from '@/lib/api-schemas';
import { apiError, apiSuccess } from '@/lib/api-response';
import {
  createStudent,
  findStudentByMatricula,
  getClassroomById,
  getStudentsByClassroom,
  getTeacherStudents,
} from '@/services/firebase/admin-data';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return apiError('UNAUTHORIZED', 'Nao autorizado', 401);
  }

  const { searchParams } = new URL(request.url);
  const turmaId = searchParams.get('turmaId');

  try {
    if (turmaId) {
      const turma = await getClassroomById(turmaId);
      if (!turma) {
        return apiError('NOT_FOUND', 'Turma nao encontrada', 404);
      }
      if ((turma.teacherId as string) !== session.userId) {
        return apiError('FORBIDDEN', 'Sem permissao para visualizar alunos desta turma', 403);
      }

      const students = await getStudentsByClassroom(turmaId);
      return apiSuccess({ students });
    }

    const students = await getTeacherStudents(session.userId as string);
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

    const turma = await getClassroomById(parsed.data.turmaId);
    if (!turma) {
      return apiError('NOT_FOUND', 'Turma nao encontrada', 404);
    }
    if ((turma.teacherId as string) !== session.userId) {
      return apiError('FORBIDDEN', 'Sem permissao para cadastrar aluno nesta turma', 403);
    }

    const matriculaExists = await findStudentByMatricula(parsed.data.matricula);
    if (matriculaExists) {
      return apiError('INVALID_REQUEST', 'Matricula ja cadastrada', 409);
    }

    const newStudent = await createStudent({
      ...parsed.data,
      teacherId: session.userId as string,
    });
    return apiSuccess({ student: newStudent }, 201);
  } catch (error) {
    console.error('Error creating student:', error);
    return apiError('INTERNAL_ERROR', 'Erro ao criar aluno', 500);
  }
}
