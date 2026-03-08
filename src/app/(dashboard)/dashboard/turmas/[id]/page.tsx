'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { ClassroomServiceFB, StudentServiceFB } from '@/services/firebase/domain-services';

type Turma = {
  id: string;
  nome: string;
  serie: string;
  turno: string;
  subject?: { name?: string };
};

export default function TurmaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: turma, isLoading: loadingTurma, error: errorTurma } = useQuery({
    queryKey: ['classroom', id],
    queryFn: () => ClassroomServiceFB.getById(id),
    enabled: !!id
  });

  const { data: alunos = [], isLoading: loadingAlunos } = useQuery({
    queryKey: ['students', id],
    queryFn: () => StudentServiceFB.getByClass(id),
    enabled: !!id
  });

  const loading = loadingTurma || loadingAlunos;
  const error = errorTurma ? (errorTurma as any).message : null;

  if (loading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center gap-4'>
        <Loader2 className='w-10 h-10 text-primary animate-spin' />
        <p className='text-slate-500 font-medium'>Carregando dados da turma...</p>
      </div>
    );
  }

  if (error || !turma) {
    return (
      <div className='space-y-8 animate-fade-in pb-24'>
        <div className='flex items-center gap-4'>
          <Link href='/dashboard/turmas'>
            <Button variant='ghost' size='icon' className='rounded-full bg-white shadow-sm border border-slate-100'>
              <ArrowLeft className='w-5 h-5 text-slate-400' />
            </Button>
          </Link>
          <h1 className='text-3xl font-serif font-black italic text-slate-900 tracking-tight'>Detalhe da Turma</h1>
        </div>

        <Card className='rounded-[2rem] border-rose-200 bg-rose-50/40'>
          <CardContent className='p-8 flex items-start gap-4'>
            <AlertTriangle className='w-6 h-6 text-rose-600 mt-1' />
            <div>
              <p className='font-bold text-rose-800'>Falha ao carregar turma</p>
              <p className='text-rose-700 text-sm mt-1'>{error || 'Turma nao encontrada.'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-8 animate-fade-in pb-24'>
      <div className='flex items-center gap-4'>
        <Link href='/dashboard/turmas'>
          <Button variant='ghost' size='icon' className='rounded-full bg-white shadow-sm border border-slate-100'>
            <ArrowLeft className='w-5 h-5 text-slate-400' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-serif font-black italic text-slate-900 tracking-tight'>{turma.nome}</h1>
          <p className='text-slate-500 font-medium text-sm italic'>Gestao da turma e alunos vinculados</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <Card className='rounded-[2.5rem] border-slate-200/60 bg-white shadow-sm'>
          <CardContent className='p-8 space-y-4'>
            <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400'>
              <BookOpen className='w-4 h-4' /> Dados da turma
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-slate-500'>Serie</p>
              <p className='font-bold text-slate-900'>{turma.serie}</p>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-slate-500'>Turno</p>
              <Badge className='bg-primary/10 text-primary border-none font-black text-[9px] uppercase'>{turma.turno}</Badge>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-slate-500'>Disciplina</p>
              <p className='font-bold text-slate-900'>{turma.subject?.name || 'Nao informada'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='lg:col-span-2 rounded-[2.5rem] border-slate-200/60 bg-white shadow-sm'>
          <CardHeader className='p-8 border-b border-slate-100'>
            <CardTitle className='text-2xl font-serif font-black italic text-slate-900 flex items-center gap-2'>
              <Users className='w-6 h-6 text-primary' />
              Alunos da turma
            </CardTitle>
          </CardHeader>
          <CardContent className='p-8'>
            {alunos.length > 0 ? (
              <div className='space-y-3'>
                {alunos.map((aluno: any) => (
                  <div key={aluno.id} className='p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between'>
                    <div>
                      <p className='font-bold text-slate-800'>{aluno.nome}</p>
                      <p className='text-[11px] text-slate-500 font-medium'>Matricula: {aluno.matricula}</p>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-300' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-16'>
                <p className='text-slate-500 font-medium'>Nenhum aluno cadastrado nesta turma.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
