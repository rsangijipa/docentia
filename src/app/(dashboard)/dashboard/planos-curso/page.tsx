'use client';

import { useState } from 'react';
import { Plus, BookMarked, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { CoursePlanServiceFB } from '@/services/firebase/domain-services';
import * as React from 'react';
import { useEffect } from 'react';

interface PlanoCurso {
  id: number;
  titulo: string;
  serie: string;
  disciplina: string;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  turmas: number;
  atualizado: string;
}

const initialPlanos: PlanoCurso[] = [
  { id: 1, titulo: 'Matemática — 6º Ano', serie: '6º Ano do Ensino Fundamental', disciplina: 'Matemática', status: 'Ativo', turmas: 2, atualizado: 'Hoje' },
  { id: 2, titulo: 'Ciências Naturais — 7º Ano', serie: '7º Ano do Ensino Fundamental', disciplina: 'Ciências', status: 'Rascunho', turmas: 1, atualizado: 'Ontem' },
];

export default function PlanosCursoPage() {
  const { user } = useAuth();
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', serie: '', disciplina: '' });

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // coursePlans are often filtered by school or room. 
      // For now we'll use a generic fetch or by school if available.
      const data = await CoursePlanServiceFB.getByTeacher(user.id);
      setPlanos(data);
    } catch (err) {
      toast.error("Erro ao carregar planos de curso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleCreate = async () => {
    if (!form.titulo || !form.serie || !form.disciplina) {
      toast.error('Preencha todos os campos.');
      return;
    }
    try {
      await CoursePlanServiceFB.create({
        ...form,
        teacherId: user?.id,
        status: 'Rascunho',
        turmas: 0,
        createdAt: new Date().toISOString()
      });
      setForm({ titulo: '', serie: '', disciplina: '' });
      setOpen(false);
      toast.success(`Plano "${form.titulo}" criado!`);
      fetchData();
    } catch (err) {
      toast.error('Erro ao criar plano de curso.');
    }
  };

  const statusCls: Record<string, string> = {
    Ativo: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Rascunho: 'bg-amber-50 text-amber-700 border border-amber-200',
    Arquivado: 'bg-muted text-muted-foreground border border-border',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Planos de Curso</h1>
          <p className="text-muted-foreground mt-1 text-sm">Estrutura mestre com objetivos, habilidades e metodologias por ano.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-sm w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Novo Plano de Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Novo Plano de Curso</DialogTitle>
              <DialogDescription>Crie a estrutura base do seu curso para o ano letivo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <Label htmlFor="pc-titulo">Título do Plano <span className="text-destructive">*</span></Label>
                <Input id="pc-titulo" placeholder="Ex: Matemática — 6º Ano" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pc-serie">Série / Ano <span className="text-destructive">*</span></Label>
                <Input id="pc-serie" placeholder="Ex: 6º Ano do Ensino Fundamental" value={form.serie} onChange={e => setForm(p => ({ ...p, serie: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pc-disciplina">Disciplina <span className="text-destructive">*</span></Label>
                <Input id="pc-disciplina" placeholder="Ex: Matemática" value={form.disciplina} onChange={e => setForm(p => ({ ...p, disciplina: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">Criar Rascunho</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {planos.map(plano => (
          <div key={plano.id} className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusCls[plano.status]}`}>
                {plano.status}
              </span>
            </div>
            <h3 className="font-serif font-bold text-foreground text-lg mb-1 leading-tight group-hover:text-primary transition-colors">
              {plano.titulo}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{plano.serie}</p>
            <div className="space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
              <div className="flex justify-between">
                <span>Disciplina</span>
                <span className="font-semibold text-foreground">{plano.disciplina}</span>
              </div>
              <div className="flex justify-between">
                <span>Turmas vinculadas</span>
                <span className="font-semibold text-foreground">{plano.turmas}</span>
              </div>
              <div className="flex justify-between">
                <span>Atualizado</span>
                <span className="font-semibold text-foreground">{plano.atualizado}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs border-border/60 text-muted-foreground gap-1.5 hover:text-primary hover:border-primary/30">
                <Pencil className="w-3 h-3" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                onClick={() => { setPlanos(p => p.filter(x => x.id !== plano.id)); toast.success('Plano removido.'); }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button
          onClick={() => setOpen(true)}
          className="border-2 border-dashed border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-muted/30 hover:border-primary/30 transition-all min-h-[240px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="font-semibold text-foreground text-sm mb-1">Criar Plano Base</p>
          <p className="text-xs text-muted-foreground px-4">Estruture unidades e habilidades da BNCC</p>
        </button>
      </div>
    </div>
  );
}
