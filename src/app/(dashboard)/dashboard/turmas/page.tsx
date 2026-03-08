'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Search, Users, Calendar, Loader2, Trash2, ChevronRight, School } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

async function readPayload(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return { success: false, message: 'Resposta invalida do servidor.' };
}

export default function TurmasPage() {
  const { user } = useAuth();
  const [turmas, setTurmas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; nome: string } | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [newTurma, setNewTurma] = React.useState({
    nome: '',
    serie: '',
    turno: 'matutino',
  });

  const fetchTurmas = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await fetch('/api/turmas', { credentials: 'include', cache: 'no-store' });
      const payload = await readPayload(response);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Erro ao carregar turmas');
      }
      setTurmas(payload.data.turmas || []);
    } catch {
      toast.error('Falha ao sincronizar turmas.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchTurmas();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/turmas', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTurma),
      });
      const payload = await readPayload(response);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Erro ao criar turma');
      }

      toast.success(`Turma ${newTurma.nome} criada com sucesso.`);
      setIsCreateOpen(false);
      setNewTurma({ nome: '', serie: '', turno: 'matutino' });
      await fetchTurmas();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao criar turma.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/turmas/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const payload = await readPayload(response);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Erro ao excluir turma');
      }

      toast.success(`Turma ${deleteTarget.nome} removida.`);
      setDeleteTarget(null);
      await fetchTurmas();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao excluir turma.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = turmas.filter((t) =>
    (t.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.serie || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-slate-500 font-medium'>Carregando turmas...</p>
      </div>
    );
  }

  return (
    <div className='space-y-8 animate-fade-in pb-24'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
        <div>
          <div className='flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-1'>
            <School className='w-4 h-4' /> Gestao de Ambientes
          </div>
          <h1 className='text-4xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 italic'>Minhas Turmas</h1>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className='h-12 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2'>
              <Plus className='w-4 h-4' /> Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[460px] rounded-2xl'>
            <form onSubmit={handleCreate} className='space-y-6'>
              <DialogHeader>
                <DialogTitle>Nova turma</DialogTitle>
                <DialogDescription>Preencha os dados da turma para iniciar o ciclo.</DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome da turma</Label>
                  <Input id='nome' value={newTurma.nome} onChange={(e) => setNewTurma({ ...newTurma, nome: e.target.value })} required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='serie'>Serie</Label>
                  <Input id='serie' value={newTurma.serie} onChange={(e) => setNewTurma({ ...newTurma, serie: e.target.value })} required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='turno'>Turno</Label>
                  <select
                    id='turno'
                    className='w-full h-10 rounded-lg border border-input bg-background px-3 text-sm'
                    value={newTurma.turno}
                    onChange={(e) => setNewTurma({ ...newTurma, turno: e.target.value })}
                  >
                    <option value='matutino'>Matutino</option>
                    <option value='vespertino'>Vespertino</option>
                    <option value='noturno'>Noturno</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar turma'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='relative w-full sm:w-96'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
        <Input
          placeholder='Pesquisar turmas...'
          className='pl-10 h-11'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filtered.map((turma) => (
          <Card key={turma.id} className='rounded-2xl border-slate-200/60 bg-white'>
            <CardContent className='p-6 space-y-5'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Badge className='bg-primary/10 text-primary border-none uppercase text-[9px]'>{turma.turno}</Badge>
                  <Badge variant='outline' className='uppercase text-[9px]'>{turma.serie}</Badge>
                </div>
                <h3 className='text-2xl font-serif font-black italic text-slate-900'>{turma.nome}</h3>
              </div>

              <div className='flex items-center justify-between text-[11px] text-slate-500'>
                <span className='flex items-center gap-2'><Users className='w-4 h-4' /> {turma.alunos?.length || 0} alunos</span>
                <span className='flex items-center gap-2'><Calendar className='w-4 h-4' /> {turma.subject?.name || 'Disciplina'}</span>
              </div>

              <div className='flex items-center justify-between'>
                <Link href={`/dashboard/turmas/${turma.id}`}>
                  <Button variant='ghost' className='p-0 h-auto text-primary font-black text-[10px] uppercase tracking-widest'>
                    Gerenciar <ChevronRight className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50'
                  onClick={() => setDeleteTarget({ id: turma.id, nome: turma.nome })}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className='py-16 text-center'>
          <p className='text-slate-500 font-medium'>Nenhuma turma encontrada.</p>
        </div>
      )}

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
        title='Remover turma'
        description={deleteTarget ? `Deseja remover a turma ${deleteTarget.nome}? Esta acao nao pode ser desfeita.` : ''}
        confirmLabel='Remover turma'
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
