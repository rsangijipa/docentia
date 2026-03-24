'use client';

import * as React from 'react';
import { ClipboardList, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { classroomService, diaryEntryService, studentService } from '@/services/supabase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

type DiaryForm = {
  turmaId: string;
  date: string;
  conteudoMinistrado: string;
  observacoes: string;
  status: string;
  attendance: Record<string, boolean>;
};

const initialForm: DiaryForm = {
  turmaId: '',
  date: '',
  conteudoMinistrado: '',
  observacoes: '',
  status: 'Realizado',
  attendance: {},
};


export default function DiarioPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [form, setForm] = React.useState<DiaryForm>(initialForm);

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);

  const { data: turmas = [], isLoading: loadingTurmas } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? classroomService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['diaries', user?.id],
    queryFn: () => user?.id ? diaryEntryService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['students', form.turmaId],
    queryFn: () => form.turmaId ? studentService.getByClass(form.turmaId) : [],
    enabled: !!form.turmaId && open
  });

  const loading = loadingTurmas || loadingItems;

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (entry: any) => {
    setEditing(entry);
    let date = '';
    if (typeof entry.date === 'string') {
      date = entry.date.slice(0, 10);
    }

    setForm({
      turmaId: entry.turma_id || '',
      date,
      conteudoMinistrado: entry.conteudo_ministrado || '',
      observacoes: entry.observacoes || '',
      status: entry.status || 'Realizado',
      attendance: entry.attendance || {},
    });
    setOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => diaryEntryService.create(payload),
    onSuccess: () => {
      toast.success('Diario registrado.');
      queryClient.invalidateQueries({ queryKey: ['diaries', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao salvar diario.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => diaryEntryService.update(id, payload),
    onSuccess: () => {
      toast.success('Diario atualizado.');
      queryClient.invalidateQueries({ queryKey: ['diaries', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao atualizar diario.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => diaryEntryService.delete(id),
    onSuccess: () => {
      toast.success('Registro removido.');
      queryClient.invalidateQueries({ queryKey: ['diaries', user?.id] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Erro ao remover registro.')
  });

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!form.turmaId || !form.date || !form.conteudoMinistrado) {
      toast.error('Preencha turma, data e conteudo.');
      return;
    }

    const payload = {
      turma_id: form.turmaId,
      teacher_id: user.id,
      date: form.date,
      conteudo_ministrado: form.conteudoMinistrado,
      observacoes: form.observacoes,
      status: form.status,
      attendance: form.attendance,
      updated_at: new Date().toISOString(),
    };

    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate({ ...payload, created_at: new Date().toISOString() });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const filtered = items.filter((entry: any) => {
    const turma = turmas.find((t: any) => t.id === (entry.turma_id));
    const source = `${entry.conteudo_ministrado || ''} ${turma?.nome || ''}`.toLowerCase();
    return source.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className='h-[60vh] flex items-center justify-center gap-3 text-slate-500'>
        <Loader2 className='w-6 h-6 animate-spin' />
        Carregando diario...
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in pb-20'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-foreground flex items-center gap-2'>
            <ClipboardList className='w-5 h-5' /> Diario de Classe
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>Registros de aula com persistencia real.</p>
        </div>
        <Button onClick={openCreate} className='gap-2 w-full sm:w-auto'>
          <Plus className='w-4 h-4' /> Novo registro
        </Button>
      </div>

      <div className='relative w-full sm:w-96'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
        <Input placeholder='Buscar por conteudo ou turma' className='pl-10' value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card className='rounded-2xl border-dashed'>
          <CardContent className='py-14 text-center text-slate-500'>Nenhum registro encontrado.</CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {filtered.map((entry) => {
            const turma = turmas.find((t: any) => t.id === (entry.roomId || entry.turmaId));
            return (
              <Card key={entry.id} className='rounded-2xl'>
                <CardContent className='p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div>
                    <p className='font-semibold text-slate-900'>{entry.conteudoMinistrado || entry.content || 'Sem conteudo'}</p>
                    <p className='text-sm text-slate-600 mt-1'>{entry.observacoes || entry.observations || 'Sem observacoes'}</p>
                    <p className='text-xs text-slate-500 mt-2'>
                      Turma: {turma?.nome || 'Nao informada'} • Data: {formatDate(entry.date)}
                    </p>
                  </div>

                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => openEdit(entry)}>
                      <Pencil className='w-3.5 h-3.5 mr-1' /> Editar
                    </Button>
                    <Button variant='outline' size='sm' className='text-destructive' onClick={() => setDeleteTarget(entry)}>
                      <Trash2 className='w-3.5 h-3.5 mr-1' /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[580px] p-0'>
          <DialogHeader className="bg-slate-900 text-white border-none py-12 px-10">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
              <ClipboardList className="w-4 h-4" /> Registro de Atividade
            </div>
            <DialogTitle className="text-white text-3xl italic">{editing ? 'Editar Registro' : 'Novo Registro de Aula'}</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">Documente o progresso pedagógico e ocorrências da aula.</DialogDescription>
          </DialogHeader>

          <div className='p-8 sm:p-10 space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='space-y-2.5'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma</Label>
                <select
                  className='w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all italic'
                  value={form.turmaId}
                  onChange={(e) => setForm((p) => ({ ...p, turmaId: e.target.value }))}
                >
                  <option value=''>Selecione a turma...</option>
                  {turmas.map((turma: any) => (
                    <option key={turma.id} value={turma.id}>{turma.nome}</option>
                  ))}
                </select>
              </div>
              <div className='space-y-2.5'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data da Aula</Label>
                <Input
                  type='date'
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
            </div>

            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conteúdo Ministrado</Label>
              <Input
                placeholder="Ex: Introdução às Frações Irredutíveis"
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm font-bold text-slate-700"
                value={form.conteudoMinistrado}
                onChange={(e) => setForm((p) => ({ ...p, conteudoMinistrado: e.target.value }))}
              />
            </div>

            <div className='space-y-4'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chamada / Presença</Label>
              <div className='max-h-[240px] overflow-y-auto border border-slate-100 rounded-2xl bg-white divide-y divide-slate-50'>
                {loadingStudents ? (
                  <div className='p-6 text-center space-y-2'>
                    <Loader2 className='w-5 h-5 animate-spin mx-auto text-primary' />
                    <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Sincronizando alunos...</p>
                  </div>
                ) : students.length > 0 ? (
                  students.map((aluno: any) => (
                    <div key={aluno.id} className='p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors'>
                      <div className='space-y-0.5'>
                        <p className='text-sm font-bold text-slate-700'>{aluno.nome}</p>
                        <p className='text-[10px] text-slate-400 font-medium'>Matricula: {aluno.matricula || '---'}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={form.attendance[aluno.id] !== false ? 'default' : 'outline'}
                        className={cn(
                          "h-10 w-10 rounded-xl text-[11px] font-black p-0 shadow-sm transition-all",
                          form.attendance[aluno.id] !== false ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "text-slate-300 border-slate-100"
                        )}
                        onClick={() => setForm(p => ({
                          ...p,
                          attendance: {
                            ...p.attendance,
                            [aluno.id]: form.attendance[aluno.id] === false
                          }
                        }))}
                      >
                        {form.attendance[aluno.id] !== false ? 'P' : 'F'}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'>
                    <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed'>
                      {form.turmaId ? 'Nenhum aluno matriculado nesta turma.' : 'Selecione uma turma para realizar a chamada.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observações e Ocorrências</Label>
              <textarea
                className='w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all resize-none'
                placeholder="Detalhe o comportamento da turma ou necessidades especiais observadas..."
                value={form.observacoes}
                onChange={(e) => setForm((p) => ({ ...p, observacoes: e.target.value }))}
              />
            </div>

            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status do Registro</Label>
              <div className="flex gap-2">
                {['Realizado', 'Pendente'].map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={form.status === s ? 'default' : 'outline'}
                    onClick={() => setForm(p => ({ ...p, status: s }))}
                    className={cn(
                      "flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      form.status === s && s === 'Realizado' && "bg-emerald-500 hover:bg-emerald-600 border-none",
                      form.status === s && s === 'Pendente' && "bg-amber-500 hover:bg-amber-600 border-none"
                    )}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50/50">
            <Button variant='outline' onClick={() => setOpen(false)} className="rounded-xl h-11 px-6">Cancelar</Button>
            <Button
              onClick={handleSubmit}
              className="rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Registro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Excluir registro do diario'
        description={deleteTarget ? `Deseja excluir este registro de ${formatDate(deleteTarget.date)}?` : ''}
        confirmLabel='Excluir'
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
