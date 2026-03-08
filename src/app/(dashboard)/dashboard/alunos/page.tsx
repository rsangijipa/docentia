'use client';

import * as React from 'react';
import { Users, Search, Plus, Loader2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

async function readPayload(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return { success: false, message: 'Resposta invalida do servidor.' };
}

export default function AlunosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; nome: string } | null>(null);

  const [newStudent, setNewStudent] = React.useState({
    nome: '',
    matricula: '',
    turmaId: '',
    status: 'ativo',
    observacoes: '',
  });

  const { data: turmasPayload, isLoading: loadingTurmas } = useQuery({
    queryKey: ['classrooms_api', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/turmas', { credentials: 'include', cache: 'no-store' });
      return readPayload(res);
    },
    enabled: !!user?.id,
  });

  const { data: studentsPayload, isLoading: loadingStudents } = useQuery({
    queryKey: ['students_api', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/students', { credentials: 'include', cache: 'no-store' });
      return readPayload(res);
    },
    enabled: !!user?.id,
  });

  const loading = loadingTurmas || loadingStudents;
  const turmas = turmasPayload?.data?.turmas || [];
  const alunos = studentsPayload?.data?.students || [];

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await readPayload(response);
      if (!response.ok || !data?.success) throw new Error(data?.message || 'Erro ao criar aluno');
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.nome} cadastrado com sucesso.`);
      setIsCreateOpen(false);
      setNewStudent({ nome: '', matricula: '', turmaId: '', status: 'ativo', observacoes: '' });
      queryClient.invalidateQueries({ queryKey: ['students_api', user?.id] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erro ao criar aluno.')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await readPayload(response);
      if (!response.ok || !data?.success) throw new Error(data?.message || 'Erro ao excluir aluno');
      return data;
    },
    onSuccess: () => {
      const nome = deleteTarget?.nome || 'Aluno';
      toast.success(`${nome} removido com sucesso.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['students_api', user?.id] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erro ao excluir aluno.')
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.turmaId) {
      toast.error('Selecione uma turma.');
      return;
    }
    createMutation.mutate(newStudent);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const filteredAlunos = alunos.filter((aluno: any) =>
    (aluno.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (aluno.matricula || '').includes(searchTerm)
  );

  if (loading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-slate-500 font-medium'>Carregando alunos...</p>
      </div>
    );
  }

  return (
    <div className='space-y-8 animate-fade-in pb-24'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
        <div>
          <div className='flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1'>
            <Users className='w-4 h-4' /> Gestao Pedagogica
          </div>
          <h1 className='text-4xl sm:text-5xl font-serif font-black italic text-slate-900'>Alunos</h1>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className='h-12 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2'>
              <Plus className='w-4 h-4' /> Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px] rounded-2xl'>
            <form onSubmit={handleCreate} className='space-y-6'>
              <DialogHeader>
                <DialogTitle>Matricular aluno</DialogTitle>
                <DialogDescription>Preencha os dados essenciais para cadastrar no ecossistema.</DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome</Label>
                  <Input id='nome' value={newStudent.nome} onChange={(e) => setNewStudent({ ...newStudent, nome: e.target.value })} required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='matricula'>Matricula</Label>
                  <Input id='matricula' value={newStudent.matricula} onChange={(e) => setNewStudent({ ...newStudent, matricula: e.target.value })} required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='turma'>Turma</Label>
                  <select
                    id='turma'
                    className='w-full h-10 rounded-lg border border-input bg-background px-3 text-sm'
                    value={newStudent.turmaId}
                    onChange={(e) => setNewStudent({ ...newStudent, turmaId: e.target.value })}
                    required
                  >
                    <option value=''>Selecione</option>
                    {turmas.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.nome} - {t.serie}</option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type='submit' disabled={createMutation.isPending}>{createMutation.isPending ? 'Salvando...' : 'Salvar aluno'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='relative w-full sm:w-96'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
        <Input
          placeholder='Pesquisar aluno...'
          className='pl-10 h-11'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className='rounded-2xl border-slate-200/60'>
        <CardHeader>
          <CardTitle className='text-2xl font-serif font-black italic text-slate-900'>Lista de alunos</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {filteredAlunos.length > 0 ? (
            filteredAlunos.map((aluno: any) => {
              const turma = turmas.find((t: any) => t.id === aluno.turmaId);
              return (
                <div key={aluno.id} className='p-4 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-center justify-between'>
                  <div>
                    <p className='font-bold text-slate-800'>{aluno.nome}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <Badge variant='outline' className='text-[10px]'>{turma?.nome || 'Sem turma'}</Badge>
                      <span className='text-[11px] text-slate-500'>Matricula: {aluno.matricula}</span>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50'
                    onClick={() => setDeleteTarget({ id: aluno.id, nome: aluno.nome })}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              );
            })
          ) : (
            <div className='py-12 text-center text-slate-500'>Nenhum aluno encontrado.</div>
          )}
        </CardContent>
      </Card>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Remover aluno'
        description={deleteTarget ? `Deseja remover ${deleteTarget.nome}? Esta acao nao pode ser desfeita.` : ''}
        confirmLabel='Remover aluno'
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
