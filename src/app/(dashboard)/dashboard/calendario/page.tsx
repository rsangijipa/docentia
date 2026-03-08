'use client';

import * as React from 'react';
import { CalendarDays, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { CalendarEventServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

type EventForm = {
  titulo: string;
  tipo: string;
  data: string;
  horario: string;
};

const initialForm: EventForm = {
  titulo: '',
  tipo: 'Atividade',
  data: '',
  horario: '',
};

function sortByDate(a: any, b: any) {
  const da = new Date(a.data || 0).getTime();
  const db = new Date(b.data || 0).getTime();
  return da - db;
}

export default function CalendarioPage() {
  const { user } = useAuth();
  const [eventos, setEventos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<EventForm>(initialForm);

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = user.schoolId
        ? await CalendarEventServiceFB.getAllBySchool(user.schoolId)
        : await CalendarEventServiceFB.getAllByTeacher(user.id);
      setEventos((data || []).sort(sortByDate));
    } catch {
      toast.error('Erro ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.schoolId]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (evento: any) => {
    setEditing(evento);
    setForm({
      titulo: evento.titulo || evento.title || '',
      tipo: evento.tipo || evento.type || 'Atividade',
      data: evento.data || '',
      horario: evento.horario || '',
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!form.titulo || !form.data) {
      toast.error('Preencha titulo e data.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        titulo: form.titulo,
        title: form.titulo,
        tipo: form.tipo,
        type: form.tipo,
        data: form.data,
        date: form.data,
        horario: form.horario,
        teacherId: user.id,
        schoolId: user.schoolId || null,
        updatedAt: new Date().toISOString(),
      };

      if (editing?.id) {
        await CalendarEventServiceFB.update(editing.id, payload);
        toast.success('Evento atualizado.');
      } else {
        await CalendarEventServiceFB.create({
          ...payload,
          createdAt: new Date().toISOString(),
        });
        toast.success('Evento criado.');
      }

      setOpen(false);
      resetForm();
      await fetchData();
    } catch {
      toast.error('Erro ao salvar evento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await CalendarEventServiceFB.delete(deleteTarget.id);
      toast.success('Evento removido.');
      setDeleteTarget(null);
      await fetchData();
    } catch {
      toast.error('Erro ao remover evento.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='h-[60vh] flex items-center justify-center gap-3 text-slate-500'>
        <Loader2 className='w-6 h-6 animate-spin' />
        Carregando calendario...
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-foreground'>Calendario Escolar</h1>
          <p className='text-sm text-muted-foreground mt-1'>Cadastro e acompanhamento real de eventos.</p>
        </div>
        <Button onClick={openCreate} className='gap-2 w-full sm:w-auto'>
          <Plus className='w-4 h-4' /> Novo evento
        </Button>
      </div>

      {eventos.length === 0 ? (
        <Card className='rounded-2xl border-dashed'>
          <CardContent className='py-14 text-center text-slate-500'>Nenhum evento cadastrado.</CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {eventos.map((evento) => (
            <Card key={evento.id} className='rounded-2xl'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base flex items-center gap-2'>
                  <CalendarDays className='w-4 h-4' /> {evento.titulo || evento.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-slate-600'>Tipo: {evento.tipo || evento.type || 'Atividade'}</p>
                <p className='text-sm text-slate-600'>Data: {evento.data || evento.date || '-'}</p>
                {evento.horario ? <p className='text-sm text-slate-600'>Horario: {evento.horario}</p> : null}
                <div className='flex gap-2 pt-2'>
                  <Button variant='outline' size='sm' onClick={() => openEdit(evento)}>Editar</Button>
                  <Button variant='outline' size='sm' className='text-destructive' onClick={() => setDeleteTarget(evento)}>
                    <Trash2 className='w-3.5 h-3.5 mr-1' /> Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[460px]'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar evento' : 'Novo evento'}</DialogTitle>
            <DialogDescription>Preencha os campos obrigatorios.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-1.5'>
              <Label>Titulo</Label>
              <Input value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='grid gap-1.5'>
                <Label>Tipo</Label>
                <select
                  className='h-10 rounded-md border border-input bg-background px-3 text-sm'
                  value={form.tipo}
                  onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                >
                  {['Atividade', 'Prova', 'Reuniao', 'Feriado'].map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div className='grid gap-1.5'>
                <Label>Horario</Label>
                <Input type='time' value={form.horario} onChange={(e) => setForm((p) => ({ ...p, horario: e.target.value }))} />
              </div>
            </div>
            <div className='grid gap-1.5'>
              <Label>Data</Label>
              <Input type='date' value={form.data} onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Excluir evento'
        description={deleteTarget ? `Deseja excluir "${deleteTarget.titulo || deleteTarget.title}"?` : ''}
        confirmLabel='Excluir'
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
