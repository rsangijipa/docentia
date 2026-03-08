'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Plus,
  Search,
  Calendar,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { CoursePlanServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

type CoursePlanForm = {
  title: string;
  description: string;
  turmaId: string;
  year: string;
};

const initialForm: CoursePlanForm = {
  title: '',
  description: '',
  turmaId: '',
  year: '2026'
};

export default function PlanejamentoPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [form, setForm] = React.useState<CoursePlanForm>(initialForm);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['coursePlans', user?.id],
    queryFn: () => user?.id ? CoursePlanServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: turmas = [] } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => CoursePlanServiceFB.create(payload),
    onSuccess: () => {
      toast.success('Plano de curso criado!');
      queryClient.invalidateQueries({ queryKey: ['coursePlans'] });
      setOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => CoursePlanServiceFB.update(id, payload),
    onSuccess: () => {
      toast.success('Plano atualizado!');
      queryClient.invalidateQueries({ queryKey: ['coursePlans'] });
      setOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CoursePlanServiceFB.delete(id),
    onSuccess: () => {
      toast.success('Plano removido.');
      queryClient.invalidateQueries({ queryKey: ['coursePlans'] });
      setDeleteTarget(null);
    }
  });

  const handleSave = () => {
    if (!form.title || !form.turmaId) return toast.error('Preencha os campos obrigatórios.');

    const payload = {
      ...form,
      teacherId: user?.id,
      updatedAt: new Date().toISOString()
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate({ ...payload, createdAt: new Date().toISOString() });
    }
  };

  const openEdit = (plan: any) => {
    setEditing(plan);
    setForm({
      title: plan.title,
      description: plan.description || '',
      turmaId: plan.turmaId,
      year: plan.year || '2026'
    });
    setOpen(true);
  };

  const filtered = plans.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black italic text-slate-900 tracking-tight">Planejamento Integrado</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de planos de curso e cronograma acadêmico.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(initialForm); setOpen(true); }} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Novo Plano de Curso
        </Button>
      </div>

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar plano..."
          className="pl-10 h-11 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((plan: any) => {
          const turma = turmas.find((t: any) => t.id === plan.turmaId);
          return (
            <Card key={plan.id} className="rounded-[2rem] group hover:border-primary/30 transition-all duration-500">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{plan.year}</Badge>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{plan.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(plan)} className="h-8 w-8 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(plan)} className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <LayoutDashboard className="w-4 h-4" />
                    Turma: <span className="font-bold text-slate-700">{turma?.nome || 'Não vinculada'}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {plan.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                <Button variant="outline" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                  Gerenciar Cronograma <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3 rounded-[2rem] border-dashed py-20">
            <CardContent className="flex flex-col items-center justify-center text-slate-400 gap-4">
              <FileText className="w-12 h-12 opacity-20" />
              <p className="font-medium">Nenhum plano de curso encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="bg-slate-900 text-white border-none py-12 px-10">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
              <FileText className="w-4 h-4" /> Arquitetura Pedagógica
            </div>
            <DialogTitle className="text-white text-3xl italic">{editing ? 'Editar Plano de Curso' : 'Novo Plano de Curso'}</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">Estruture as competências e objetivos para o período letivo.</DialogDescription>
          </DialogHeader>

          <div className="p-8 sm:p-10 space-y-6">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Plano</Label>
              <Input
                placeholder="Ex: Matemática - 9º Ano A"
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm font-bold text-slate-700"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma Vinculada</Label>
                <select
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all italic"
                  value={form.turmaId}
                  onChange={(e) => setForm({ ...form, turmaId: e.target.value })}
                >
                  <option value="">Selecione a turma...</option>
                  {turmas.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ano Letivo</Label>
                <Input
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm text-center font-bold"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição / Ementa do Curso</Label>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all resize-none"
                placeholder="Descreva os objetivos gerais e a metodologia que será aplicada..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="bg-slate-50/50">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11 px-6">Cancelar</Button>
            <Button
              onClick={handleSave}
              className="rounded-xl h-11 px-10 font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Salvar Alterações' : 'Criar Plano'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Excluir Plano de Curso?"
        description="Esta ação não pode ser desfeita. Todos os vínculos de cronograma serão mantidos, mas o plano base será removido."
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
