'use client';

import * as React from 'react';
import { ClipboardList, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { ClassroomServiceFB, DiaryEntryServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type DiaryForm = {
  turmaId: string;
  date: string;
  conteudoMinistrado: string;
  observacoes: string;
  status: string;
};

const initialForm: DiaryForm = {
  turmaId: '',
  date: '',
  conteudoMinistrado: '',
  observacoes: '',
  status: 'Realizado',
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
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['diaries', user?.id],
    queryFn: () => user?.id ? DiaryEntryServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id,
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
    } else if (entry.date?.seconds) {
      date = new Date(entry.date.seconds * 1000).toISOString().slice(0, 10);
    }

    setForm({
      turmaId: entry.roomId || entry.turmaId || '',
      date,
      conteudoMinistrado: entry.conteudoMinistrado || entry.content || '',
      observacoes: entry.observacoes || entry.observations || '',
      status: entry.status || 'Realizado',
    });
    setOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => DiaryEntryServiceFB.create(payload),
    onSuccess: () => {
      toast.success('Diario registrado.');
      queryClient.invalidateQueries({ queryKey: ['diaries', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao salvar diario.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => DiaryEntryServiceFB.update(id, payload),
    onSuccess: () => {
      toast.success('Diario atualizado.');
      queryClient.invalidateQueries({ queryKey: ['diaries', user?.id] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Erro ao atualizar diario.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DiaryEntryServiceFB.delete(id),
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
      roomId: form.turmaId,
      turmaId: form.turmaId,
      teacherId: user.id,
      date: new Date(`${form.date}T08:00:00`).toISOString(),
      conteudoMinistrado: form.conteudoMinistrado,
      content: form.conteudoMinistrado,
      observacoes: form.observacoes,
      observations: form.observacoes,
      status: form.status,
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

  const filtered = items.filter((entry: any) => {
    const turma = turmas.find((t: any) => t.id === (entry.roomId || entry.turmaId));
    const source = `${entry.conteudoMinistrado || entry.content || ''} ${turma?.nome || ''}`.toLowerCase();
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
        <DialogContent className='sm:max-w-[560px]'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar diario' : 'Novo diario'}</DialogTitle>
            <DialogDescription>Preencha os dados da aula.</DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='grid gap-1.5'>
                <Label>Turma</Label>
                <select
                  className='h-10 rounded-md border border-input bg-background px-3 text-sm'
                  value={form.turmaId}
                  onChange={(e) => setForm((p) => ({ ...p, turmaId: e.target.value }))}
                >
                  <option value=''>Selecione</option>
                  {turmas.map((turma: any) => (
                    <option key={turma.id} value={turma.id}>{turma.nome}</option>
                  ))}
                </select>
              </div>
              <div className='grid gap-1.5'>
                <Label>Data</Label>
                <Input type='date' value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
            </div>

            <div className='grid gap-1.5'>
              <Label>Conteudo ministrado</Label>
              <Input
                value={form.conteudoMinistrado}
                onChange={(e) => setForm((p) => ({ ...p, conteudoMinistrado: e.target.value }))}
              />
            </div>

            <div className='grid gap-1.5'>
              <Label>Observacoes</Label>
              <Input value={form.observacoes} onChange={(e) => setForm((p) => ({ ...p, observacoes: e.target.value }))} />
            </div>

            <div className='grid gap-1.5'>
              <Label>Status</Label>
              <select
                className='h-10 rounded-md border border-input bg-background px-3 text-sm'
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value='Realizado'>Realizado</option>
                <option value='Pendente'>Pendente</option>
              </select>
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
        title='Excluir registro do diario'
        description={deleteTarget ? `Deseja excluir este registro de ${formatDate(deleteTarget.date)}?` : ''}
        confirmLabel='Excluir'
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
