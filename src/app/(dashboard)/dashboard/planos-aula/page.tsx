'use client';

import * as React from 'react';
import { Calendar, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { ClassroomServiceFB, LessonPlanServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
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
};

const initialForm: LessonForm = {
  titulo: '',
  turmaId: '',
  data: '',
  objetivo: '',
  metodologia: '',
  recursos: '',
  habilidades: '',
};

function dateInputToIso(dateInput: string) {
  if (!dateInput) return new Date().toISOString();
  return new Date(`${dateInput}T08:00:00`).toISOString();
}


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
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: planos = [], isLoading: loadingPlanos } = useQuery({
    queryKey: ['lessonPlans', user?.id],
    queryFn: () => user?.id ? LessonPlanServiceFB.getByTeacher(user.id) : [],
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
    } else if (plano.date?.seconds) {
      date = new Date(plano.date.seconds * 1000).toISOString().slice(0, 10);
    }

    setForm({
      titulo: plano.topic || plano.titulo || '',
      turmaId: plano.turmaId || plano.roomId || '',
      data: date,
      objetivo: plano.goals || plano.objetivo || '',
      metodologia: plano.methodology || plano.metodologia || '',
      recursos: plano.resources || plano.recursos || '',
      habilidades: plano.habilidades || '',
    });
    setOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => LessonPlanServiceFB.create(payload),
    onSuccess: () => {
      toast.success('Plano de aula criado.');
      queryClient.invalidateQueries({ queryKey: ['lessonPlans', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao salvar plano de aula.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => LessonPlanServiceFB.update(id, payload),
    onSuccess: () => {
      toast.success('Plano de aula atualizado.');
      queryClient.invalidateQueries({ queryKey: ['lessonPlans', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao atualizar plano de aula.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => LessonPlanServiceFB.delete(id),
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

    const turma = turmas.find((t: any) => t.id === form.turmaId);

    const payload = {
      topic: form.titulo,
      turmaId: form.turmaId,
      roomId: form.turmaId,
      nomeTurma: turma?.nome || null,
      date: dateInputToIso(form.data),
      goals: form.objetivo,
      methodology: form.metodologia,
      resources: form.recursos,
      habilidades: form.habilidades,
      teacherId: user.id,
      status: 'Planejado',
      updatedAt: new Date().toISOString(),
    };

    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate({ ...payload, createdAt: new Date().toISOString() });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const filtered = planos.filter((p) => {
    const turmaName = turmas.find((t) => t.id === (p.turmaId || p.roomId))?.nome || p.nomeTurma || '';
    const title = p.topic || p.titulo || '';
    return `${title} ${turmaName}`.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className='h-[60vh] flex items-center justify-center gap-3 text-slate-500'>
        <Loader2 className='w-6 h-6 animate-spin' />
        Carregando planos de aula...
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in pb-20'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-foreground tracking-tight'>Planos de Aula</h1>
          <p className='text-muted-foreground text-sm mt-1'>CRUD operacional com persistencia real.</p>
        </div>
        <Button onClick={openCreate} className='gap-2 w-full sm:w-auto'>
          <Plus className='w-4 h-4' /> Novo plano
        </Button>
      </div>

      <div className='relative w-full sm:w-96'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
        <Input placeholder='Buscar por tema ou turma' className='pl-10' value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card className='rounded-2xl border-dashed'>
          <CardContent className='py-14 text-center text-slate-500'>Nenhum plano de aula encontrado.</CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {filtered.map((plano) => {
            const turma = turmas.find((t) => t.id === (plano.turmaId || plano.roomId));
            return (
              <Card key={plano.id} className='rounded-2xl'>
                <CardContent className='p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div>
                    <p className='font-semibold text-slate-900'>{plano.topic || plano.titulo || 'Sem titulo'}</p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      <Badge variant='outline'>{turma?.nome || plano.nomeTurma || 'Sem turma'}</Badge>
                      <Badge variant='secondary' className='gap-1'>
                        <Calendar className='w-3 h-3' /> {formatDate(plano.date)}
                      </Badge>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' className='gap-1.5' onClick={() => openEdit(plano)}>
                      <Pencil className='w-3.5 h-3.5' /> Editar
                    </Button>
                    <Button variant='outline' size='sm' className='text-destructive' onClick={() => setDeleteTarget(plano)}>
                      <Trash2 className='w-3.5 h-3.5' /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[540px]'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar plano de aula' : 'Novo plano de aula'}</DialogTitle>
            <DialogDescription>Preencha os campos obrigatorios para salvar.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-1.5'>
              <Label>Titulo</Label>
              <Input value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='grid gap-1.5'>
                <Label>Turma</Label>
                <select
                  className='h-10 rounded-md border border-input bg-background px-3 text-sm'
                  value={form.turmaId}
                  onChange={(e) => setForm((p) => ({ ...p, turmaId: e.target.value }))}
                >
                  <option value=''>Selecione</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>{turma.nome}</option>
                  ))}
                </select>
              </div>
              <div className='grid gap-1.5'>
                <Label>Data</Label>
                <Input type='date' value={form.data} onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))} />
              </div>
            </div>
            <div className='grid gap-1.5'>
              <Label>Objetivo</Label>
              <Input value={form.objetivo} onChange={(e) => setForm((p) => ({ ...p, objetivo: e.target.value }))} />
            </div>
            <div className='grid gap-1.5'>
              <Label>Metodologia</Label>
              <Input value={form.metodologia} onChange={(e) => setForm((p) => ({ ...p, metodologia: e.target.value }))} />
            </div>
            <div className='grid gap-1.5'>
              <Label>Recursos</Label>
              <Input value={form.recursos} onChange={(e) => setForm((p) => ({ ...p, recursos: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>{(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Excluir plano de aula'
        description={deleteTarget ? `Deseja excluir "${deleteTarget.topic || deleteTarget.titulo}"?` : ''}
        confirmLabel='Excluir'
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
