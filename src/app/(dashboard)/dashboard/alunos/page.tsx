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
import { cn } from '@/lib/utils';
import { classroomService, studentService } from '@/services/supabase/domain-services';

export default function AlunosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; nome: string } | null>(null);

  const [newStudent, setNewStudent] = React.useState({
    nome: '',
    matricula: '',
    turma_id: '',
    status: 'ativo',
    observacoes: '',
  });

  const { data: turmas = [], isLoading: loadingTurmas } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? classroomService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: alunos = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['students', user?.id],
    queryFn: () => user?.id ? studentService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => studentService.create(payload),
    onSuccess: (_, variables) => {
      toast.success(`${variables.nome} cadastrado com sucesso.`);
      setIsCreateOpen(false);
      setNewStudent({ nome: '', matricula: '', turma_id: '', status: 'ativo', observacoes: '' });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erro ao criar aluno.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      const nome = deleteTarget?.nome || 'Aluno';
      toast.success(`${nome} removido com sucesso.`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erro ao excluir aluno.')
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.turma_id) {
      toast.error('Selecione uma turma.');
      return;
    }
    createMutation.mutate({
      ...newStudent,
      teacher_id: user?.id,
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const filteredAlunos = alunos.filter((aluno: any) =>
    (aluno.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (aluno.matricula || '').includes(searchTerm)
  );

  if (loadingTurmas || loadingStudents) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-slate-500 font-medium'>Carregando alunos...</p>
      </div>
    );
  }

  return (
    <div className='space-y-10 animate-fade-in pb-24'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div className="space-y-1">
          <div className='flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px]'>
            <Users className='w-4 h-4' /> Gestão de Discentes
          </div>
          <h1 className='text-4xl sm:text-5xl font-serif font-black italic text-slate-900 tracking-tight'>Matrícula & Alunos</h1>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className='h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.1em] gap-3 shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all'>
              <Plus className='w-5 h-5' /> Matricular Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-lg p-0 overflow-hidden border-none shadow-3xl'>
            <DialogHeader className="bg-slate-900 text-white py-12 px-10 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                  <Users className="w-4 h-4" /> Cadastro Institucional
                </div>
                <DialogTitle className="text-white text-3xl italic">Novo Aluno</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">Insira as credenciais do aluno para o sistema.</DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className='space-y-5'>
                <div className='space-y-2'>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</Label>
                  <Input
                    className="h-12 rounded-xl border-slate-200 font-bold"
                    placeholder="Ex: João Silva Santos"
                    value={newStudent.nome}
                    onChange={(e) => setNewStudent({ ...newStudent, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matrícula/ID</Label>
                    <Input
                      className="h-12 rounded-xl border-slate-200 font-bold text-center"
                      placeholder="000.000"
                      value={newStudent.matricula}
                      onChange={(e) => setNewStudent({ ...newStudent, matricula: e.target.value })}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma</Label>
                    <select
                      className='w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all italic'
                      value={newStudent.turma_id}
                      onChange={(e) => setNewStudent({ ...newStudent, turma_id: e.target.value })}
                      required
                    >
                      <option value=''>Selecione...</option>
                      {turmas.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observações (Opcional)</Label>
                  <textarea
                    className='w-full min-h-[100px] p-4 rounded-xl border border-slate-200 text-sm italic resize-none bg-slate-50/50'
                    placeholder="PCD, necessidades especiais ou notas relevantes..."
                    value={newStudent.observacoes}
                    onChange={(e) => setNewStudent({ ...newStudent, observacoes: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 gap-3">
                <Button type='button' variant='outline' onClick={() => setIsCreateOpen(false)} className="rounded-xl h-12 px-6">Cancelar</Button>
                <Button
                  type='submit'
                  className="rounded-xl h-12 px-10 bg-slate-900 font-black uppercase tracking-widest text-[10px] gap-2"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Matrícula'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className='relative w-full sm:w-96 group'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
          <Input
            placeholder='Pesquisar por nome ou matrícula...'
            className='pl-12 h-14 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary transition-all text-sm font-medium'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrar por Status:</span>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 cursor-pointer transition-colors">Ativos ({alunos.length})</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlunos.length > 0 ? (
          filteredAlunos.map((aluno: any) => {
            const turma = turmas.find((t: any) => t.id === aluno.turma_id);
            return (
              <Card key={aluno.id} className='rounded-[2.5rem] group hover:border-primary/40 transition-all duration-500 overflow-hidden border-slate-200/60 shadow-lg hover:shadow-xl hover:shadow-primary/5 bg-white'>
                <CardContent className='p-8 space-y-6'>
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-inner">
                      {aluno.nome.charAt(0)}
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100'
                      onClick={() => setDeleteTarget({ id: aluno.id, nome: aluno.nome })}
                    >
                      <Trash2 className='w-5 h-5' />
                    </Button>
                  </div>

                  <div className='space-y-1'>
                    <h4 className='text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1'>{aluno.nome}</h4>
                    <div className='flex items-center gap-3'>
                      <Badge variant='outline' className='text-[8px] font-black uppercase tracking-widest text-slate-400 border-slate-100'>
                        {turma?.nome || 'PENDENTE'}
                      </Badge>
                      <span className='text-[10px] font-bold text-slate-400'>ID: {aluno.matricula}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Presença Média</span>
                      <span className="text-sm font-bold text-slate-700">94.2%</span>
                    </div>
                    <Button variant="outline" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-slate-50 border-none hover:bg-primary hover:text-white transition-all">
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className='col-span-full py-32 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200'>
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
              <Users className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className='text-slate-500 font-bold'>Nenhum aluno encontrado.</p>
              <p className="text-slate-400 text-xs">Tente ajustar sua busca ou cadastrar um novo aluno.</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState: boolean) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Exclusão de Registro'
        description={deleteTarget ? `Tem certeza que deseja remover o registro de ${deleteTarget.nome}? Os dados históricos de frequência e avaliações serão arquivados.` : ''}
        confirmLabel='Confirmar Remoção'
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
