'use client';

import * as React from 'react';
import { BookMarked, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { CoursePlanServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

type CoursePlanForm = {
  titulo: string;
  serie: string;
  disciplina: string;
};

const initialForm: CoursePlanForm = {
  titulo: '',
  serie: '',
  disciplina: '',
};

export default function PlanosCursoPage() {
  const { user } = useAuth();
  const [planos, setPlanos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<CoursePlanForm>(initialForm);

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await CoursePlanServiceFB.getByTeacher(user.id);
      setPlanos(data);
    } catch {
      toast.error('Erro ao carregar planos de curso.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (plano: any) => {
    setEditing(plano);
    setForm({
      titulo: plano.titulo || '',
      serie: plano.serie || '',
      disciplina: plano.disciplina || '',
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!form.titulo || !form.serie || !form.disciplina) {
      toast.error('Preencha titulo, serie e disciplina.');
      return;
    }

    setSubmitting(true);
    try {
      if (editing?.id) {
        await CoursePlanServiceFB.update(editing.id, {
          ...form,
          updatedAt: new Date().toISOString(),
        });
        toast.success('Plano de curso atualizado.');
      } else {
        await CoursePlanServiceFB.create({
          ...form,
          teacherId: user.id,
          status: 'Ativo',
          turmas: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success('Plano de curso criado.');
      }

      setOpen(false);
      resetForm();
      await fetchData();
    } catch {
      toast.error('Erro ao salvar plano de curso.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await CoursePlanServiceFB.delete(deleteTarget.id);
      toast.success('Plano removido com sucesso.');
      setDeleteTarget(null);
      await fetchData();
    } catch {
      toast.error('Erro ao remover plano de curso.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='h-[60vh] flex items-center justify-center gap-3 text-slate-500'>
        <Loader2 className='w-6 h-6 animate-spin' />
        Carregando planos de curso...
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4'>
        <div>
          <h1 className='text-2xl font-serif font-bold text-foreground tracking-tight'>Planos de Curso</h1>
          <p className='text-muted-foreground mt-1 text-sm'>Fluxo operacional com persistencia real.</p>
        </div>

        <Button onClick={openCreate} className='bg-primary hover:bg-primary/90 gap-2 w-full sm:w-auto'>
          <Plus className='w-4 h-4' /> Novo Plano
        </Button>
      </div>

      {planos.length === 0 ? (
        <Card className='rounded-2xl border-dashed'>
          <CardContent className='py-14 text-center text-slate-500'>Nenhum plano de curso cadastrado.</CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {planos.map((plano) => (
            <Card key={plano.id} className='rounded-2xl border border-border/60'>
              <CardContent className='p-5 space-y-4'>
                <div className='flex items-start justify-between'>
                  <div className='p-2.5 bg-primary/10 text-primary rounded-xl'>
                    <BookMarked className='w-5 h-5' />
                  </div>
                  <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'>
                    {plano.status || 'Ativo'}
                  </span>
                </div>

                <div>
                  <h3 className='font-serif font-bold text-foreground text-lg leading-tight'>{plano.titulo}</h3>
                  <p className='text-sm text-muted-foreground'>{plano.serie}</p>
                </div>

                <div className='text-xs text-muted-foreground border-t border-border/50 pt-3 space-y-1'>
                  <div className='flex justify-between'>
                    <span>Disciplina</span>
                    <span className='font-semibold text-foreground'>{plano.disciplina || '-'}</span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button variant='outline' size='sm' className='flex-1 gap-1.5' onClick={() => openEdit(plano)}>
                    <Pencil className='w-3 h-3' /> Editar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive hover:text-destructive'
                    onClick={() => setDeleteTarget(plano)}
                  >
                    <Trash2 className='w-3 h-3' />
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
            <DialogTitle>{editing ? 'Editar plano de curso' : 'Novo plano de curso'}</DialogTitle>
            <DialogDescription>Preencha os dados principais do plano.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-1.5'>
              <Label>Titulo</Label>
              <Input value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div className='grid gap-1.5'>
              <Label>Serie</Label>
              <Input value={form.serie} onChange={(e) => setForm((p) => ({ ...p, serie: e.target.value }))} />
            </div>
            <div className='grid gap-1.5'>
              <Label>Disciplina</Label>
              <Input value={form.disciplina} onChange={(e) => setForm((p) => ({ ...p, disciplina: e.target.value }))} />
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
        title='Excluir plano de curso'
        description={deleteTarget ? `Deseja excluir "${deleteTarget.titulo}"?` : ''}
        confirmLabel='Excluir'
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
