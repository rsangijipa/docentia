'use client';

import * as React from 'react';
import { ArrowRight, Calendar, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

type LessonForm = {
  titulo: string;
  turmaId: string;
  data: string;
  objetivo: string;
  metodologia: string;
  recursos: string;
  habilidades: string;
  bnccCodes: string[];
};

const initialForm: LessonForm = {
  titulo: '',
  turmaId: '',
  data: '',
  objetivo: '',
  metodologia: '',
  recursos: '',
  habilidades: '',
  bnccCodes: [],
};

function dateInputToIso(dateInput: string) {
  if (!dateInput) return new Date().toISOString();
  return new Date(`${dateInput}T08:00:00`).toISOString();
}
import { classroomService, lessonPlanService } from '@/services/supabase/domain-services';

export default function PlanosAulaPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [form, setForm] = React.useState<LessonForm>(initialForm);

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);

  const { data: turmas = [], isLoading: loadingTurmas } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? classroomService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: planos = [], isLoading: loadingPlanos } = useQuery({
    queryKey: ['lessonPlans', user?.id],
    queryFn: () => user?.id ? lessonPlanService.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const loading = loadingTurmas || loadingPlanos;

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (plano: any) => {
    setEditing(plano);

    let date = '';
    if (typeof plano.date === 'string') {
      date = plano.date.slice(0, 10);
    }

    setForm({
      titulo: plano.topic || '',
      turmaId: plano.turma_id || '',
      data: date,
      objetivo: plano.goals || '',
      metodologia: plano.methodology || '',
      recursos: plano.resources || '',
      habilidades: plano.habilidades || '',
      bnccCodes: plano.bncc_codes || [],
    });
    setOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => lessonPlanService.create(payload),
    onSuccess: () => {
      toast.success('Plano de aula criado.');
      queryClient.invalidateQueries({ queryKey: ['lessonPlans', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao salvar plano de aula.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => lessonPlanService.update(id, payload),
    onSuccess: () => {
      toast.success('Plano de aula atualizado.');
      queryClient.invalidateQueries({ queryKey: ['lessonPlans', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao atualizar plano de aula.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lessonPlanService.delete(id),
    onSuccess: () => {
      toast.success('Plano removido com sucesso.');
      queryClient.invalidateQueries({ queryKey: ['lessonPlans', user?.id] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Erro ao remover plano.')
  });

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!form.titulo || !form.turmaId || !form.data) {
      toast.error('Preencha titulo, turma e data.');
      return;
    }

    const payload = {
      topic: form.titulo,
      turma_id: form.turmaId,
      date: dateInputToIso(form.data),
      goals: form.objetivo,
      methodology: form.metodologia,
      resources: form.recursos,
      habilidades: form.habilidades,
      bncc_codes: form.bnccCodes,
      teacher_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate({ 
        ...payload, 
        created_at: new Date().toISOString() 
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const filtered = planos.filter((p: any) => {
    const turmaName = turmas.find((t: any) => t.id === (p.turma_id))?.nome || '';
    const title = p.topic || '';
    return `${title} ${turmaName}`.toLowerCase().includes(search.toLowerCase());
  });

  if (loadingTurmas || loadingPlanos) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-slate-500 font-medium'>Carregando planos de aula...</p>
      </div>
    );
  }

  return (
    <div className='space-y-10 animate-fade-in pb-24'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div className="space-y-1">
          <div className='flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]'>
            <Calendar className='w-4 h-4' /> Roteiros de Aprendizagem
          </div>
          <h1 className='text-4xl sm:text-5xl font-serif font-black italic text-slate-900 tracking-tight'>Planos de Aula</h1>
        </div>

        <Button onClick={openCreate} className='h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.1em] gap-3 shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all'>
          <Plus className='w-5 h-5' /> Novo Plano
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className='relative w-full sm:w-96 group'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
          <Input
            placeholder='Filtrar por tema ou turma...'
            className='pl-12 h-14 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary transition-all text-sm font-medium'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='py-32 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200'>
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
            <Calendar className="w-10 h-10" />
          </div>
          <div className="text-center">
            <p className='text-slate-500 font-bold'>Nenhum roteiro planejado.</p>
            <p className="text-slate-400 text-xs">Comece definindo seus objetivos para as próximas aulas.</p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {filtered.map((plano: any) => {
            const turma = turmas.find((t: any) => t.id === (plano.turmaId || plano.roomId));
            return (
              <Card key={plano.id} className='rounded-[2.5rem] group hover:border-primary/40 transition-all duration-500 overflow-hidden border-slate-200/60 shadow-lg hover:shadow-xl hover:shadow-primary/5 bg-white'>
                <CardContent className='p-8 space-y-6'>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant='outline' className='text-[8px] font-black uppercase tracking-widest text-slate-400 border-slate-100'>
                          {turma?.nome || plano.nomeTurma || 'SEM TURMA'}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 h-4">Ativo</Badge>
                      </div>
                      <h4 className='text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight'>{plano.topic || plano.titulo || 'Sem título'}</h4>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant='ghost' size='icon' className='h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5' onClick={() => openEdit(plano)}>
                        <Pencil className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='icon' className='h-9 w-9 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50' onClick={() => setDeleteTarget(plano)}>
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {plano.goals && (
                      <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">
                        &quot;{plano.goals}&quot;
                      </p>
                    )}

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Data Prevista</span>
                          <span className="text-xs font-bold text-slate-700">{formatDate(plano.date)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 text-primary hover:bg-primary/5">
                        Ver Detalhes <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-xl p-0 overflow-hidden border-none shadow-3xl'>
          <DialogHeader className="bg-slate-900 text-white py-12 px-10 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                <Plus className="w-4 h-4" /> Design de Roteiro
              </div>
              <DialogTitle className="text-white text-3xl italic">{editing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">Defina a estrutura pedagógica para esta sessão.</DialogDescription>
            </div>
          </DialogHeader>

          <div className='p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título / Tema da Aula</Label>
                <Input
                  className="h-12 rounded-xl border-slate-200 font-bold"
                  placeholder="Ex: Introdução a Equações de 2º Grau"
                  value={form.titulo}
                  onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className='space-y-2'>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma Destino</Label>
                  <select
                    className='w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all italic'
                    value={form.turmaId}
                    onChange={(e) => setForm((p) => ({ ...p, turmaId: e.target.value }))}
                  >
                    <option value=''>Selecione...</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>{turma.nome}</option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data de Aplicação</Label>
                  <Input
                    type='date'
                    className="h-12 rounded-xl border-slate-200 font-bold"
                    value={form.data}
                    onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objetivos de Aprendizagem</Label>
                <textarea
                  className='w-full min-h-[80px] p-4 rounded-xl border border-slate-200 text-sm italic resize-none bg-slate-50/50'
                  placeholder="O que o aluno deve ser capaz de fazer após esta aula?"
                  value={form.objetivo}
                  onChange={(e) => setForm((p) => ({ ...p, objetivo: e.target.value }))}
                />
              </div>

              <div className='space-y-2'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Metodologia & Recursos</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <textarea
                    className='w-full min-h-[80px] p-4 rounded-xl border border-slate-200 text-sm bg-white'
                    placeholder="Métodos..."
                    value={form.metodologia}
                    onChange={(e) => setForm((p) => ({ ...p, metodologia: e.target.value }))}
                  />
                  <textarea
                    className='w-full min-h-[80px] p-4 rounded-xl border border-slate-200 text-sm bg-white'
                    placeholder="Recursos..."
                    value={form.recursos}
                    onChange={(e) => setForm((p) => ({ ...p, recursos: e.target.value }))}
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Habilidades BNCC</Label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {form.bnccCodes.map(code => (
                    <Badge key={code} className='bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer' onClick={() => setForm(f => ({ ...f, bnccCodes: f.bnccCodes.filter(c => c !== code) }))}>
                      {code} ×
                    </Badge>
                  ))}
                </div>
                <div className='flex gap-2'>
                  <Input
                    placeholder="Ex: EF09MA01"
                    className='h-10 rounded-xl uppercase'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim().toUpperCase();
                        if (val && !form.bnccCodes.includes(val)) {
                          setForm(f => ({ ...f, bnccCodes: [...f.bnccCodes, val] }));
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <Button variant="outline" className='h-10 rounded-xl px-4' onClick={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    const val = input.value.trim().toUpperCase();
                    if (val && !form.bnccCodes.includes(val)) {
                      setForm(f => ({ ...f, bnccCodes: [...f.bnccCodes, val] }));
                      input.value = '';
                    }
                  }}>Add</Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50/50 pt-6 gap-3">
            <Button variant='outline' onClick={() => setOpen(false)} className="rounded-xl h-12 px-6">Cancelar</Button>
            <Button
              onClick={handleSubmit}
              className="rounded-xl h-12 px-10 bg-primary font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Planejamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Excluir Planejamento?'
        description={deleteTarget ? `O roteiro "${deleteTarget.topic || deleteTarget.titulo}" será removido permanentemente. Esta ação não afeta registros de diário já realizados.` : ''}
        confirmLabel='Excluir Definitivamente'
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
