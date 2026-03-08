'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Filter,
  Pencil,
  Trash2,
  Eye,
  BookOpen,
  Target,
  ListChecks,
  MessageSquare,
  ChevronRight,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { LessonPlanServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import * as React from 'react';
import { useEffect } from 'react';

interface PlanoAula {
  id: number;
  titulo: string;
  turma: string;
  data: string;
  status: 'Planejado' | 'Rascunho' | 'Executado';
  objetivo?: string;
  metodologia?: string;
  recursos?: string;
  habilidades?: string;
}

const statusConfig: Record<string, { label: string; cls: string; dot: string }> = {
  Executado: { label: 'Executado', cls: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  Planejado: { label: 'Planejado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  Rascunho: { label: 'Rascunho', cls: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
};

export default function PlanosAulaPage() {
  const { user } = useAuth();
  const [planos, setPlanos] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [form, setForm] = useState({
    titulo: '',
    turmaId: '',
    data: '',
    objetivo: '',
    metodologia: '',
    recursos: '',
    habilidades: ''
  });

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [planosData, turmasData] = await Promise.all([
        LessonPlanServiceFB.getByTeacher(user.id),
        ClassroomServiceFB.getByTeacher(user.id)
      ]);
      setPlanos(planosData);
      setTurmas(turmasData);
    } catch (err) {
      toast.error("Erro ao carregar roteiros e turmas.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [user?.id]);

  const filtered = planos.filter(p => {
    const turma = turmas.find(t => t.id === p.turmaId);
    const turmaName = turma?.nome || '';
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) ||
      turmaName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!form.titulo || !form.turmaId || !form.data) {
      toast.error('Preencha os campos obrigatórios (Título, Turma e Data).');
      return;
    }
    try {
      await LessonPlanServiceFB.create({
        ...form,
        teacherId: user?.id,
        status: 'Rascunho',
        createdAt: new Date().toISOString()
      });
      setForm({ titulo: '', turmaId: '', data: '', objetivo: '', metodologia: '', recursos: '', habilidades: '' });
      setOpen(false);
      toast.success(`Plano "${form.titulo}" criado como rascunho!`);
      fetchData();
    } catch (err) {
      toast.error('Erro ao criar plano de aula.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Mobile Otimizado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">Documentação Pedagógica</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">Planos de Aula</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">Gerencie e refine os roteiros de suas aulas diárias.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 sm:h-12 w-full sm:w-auto bg-slate-900 text-white rounded-2xl sm:rounded-xl shadow-xl shadow-slate-200 font-bold gap-2">
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> Novo Roteiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Criar Novo Plano de Aula</DialogTitle>
              <DialogDescription className="font-medium">Preencha os detalhes pedagógicos para sua próxima aula.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-8 py-6">
              {/* Seção Básica */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Informações Gerais</p>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pa-titulo" className="text-xs font-bold text-slate-700">Tema da Aula <span className="text-rose-500">*</span></Label>
                    <Input id="pa-titulo" placeholder="Ex: Introdução às Frações Complexas" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pa-turma" className="text-xs font-bold text-slate-700">Turma Responsável <span className="text-rose-500">*</span></Label>
                      <select
                        id="pa-turma"
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        value={form.turmaId}
                        onChange={e => setForm(p => ({ ...p, turmaId: e.target.value }))}
                      >
                        <option value="">Selecione a Turma</option>
                        {turmas.map(t => (
                          <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pa-data" className="text-xs font-bold text-slate-700">Data Prevista <span className="text-rose-500">*</span></Label>
                      <Input id="pa-data" type="date" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção Pedagógica */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2">Diretrizes Pedagógicas</p>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="pa-habilidades" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-indigo-500" /> Habilidades BNCC
                    </Label>
                    <Input id="pa-habilidades" placeholder="Ex: EF07MA18, EF07MA19" value={form.habilidades} onChange={e => setForm(p => ({ ...p, habilidades: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pa-objetivo" className="text-xs font-bold text-slate-700">Objetivos de Aprendizagem</Label>
                    <textarea
                      id="pa-objetivo"
                      className="flex min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-medium placeholder:text-slate-400"
                      placeholder="Quais competências o aluno deve masterizar?"
                      value={form.objetivo}
                      onChange={e => setForm(p => ({ ...p, objetivo: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pa-metodologia" className="text-xs font-bold text-slate-700">Metodologia e Recursos</Label>
                    <textarea
                      id="pa-metodologia"
                      className="flex min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-medium placeholder:text-slate-400"
                      placeholder="Como a aula será conduzida? Quais materiais serão usados?"
                      value={form.metodologia}
                      onChange={e => setForm(p => ({ ...p, metodologia: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button variant="ghost" className="rounded-2xl h-12 font-bold text-slate-400" onClick={() => setOpen(false)}>Descartar</Button>
              <Button onClick={handleCreate} className="rounded-2xl h-12 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-8">Salvar como Rascunho</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar roteiro..."
            className="pl-12 h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm focus:ring-primary/10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-8 flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
          {['Todos', 'Rascunho', 'Planejado', 'Executado'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "whitespace-nowrap px-6 h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border shrink-0",
                statusFilter === s
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
              )}
            >
              {s}
            </button>
          ))}
          <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 shrink-0">
            <Filter className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black bg-slate-50/50">
              <th className="px-8 py-5">Tema e Estratégia</th>
              <th className="px-8 py-5">Turma</th>
              <th className="px-8 py-5">Cronograma</th>
              <th className="px-8 py-5">Status IA</th>
              <th className="px-8 py-5 text-right font-black">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length > 0 ? filtered.map(plano => {
              const sc = statusConfig[plano.status];
              return (
                <tr key={plano.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => toast.info(`Visualizando ${plano.titulo}`)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-base tracking-tight">{plano.titulo}</p>
                        {plano.habilidades && (
                          <div className="flex gap-2">
                            {plano.habilidades.split(',').map((h: string) => (
                              <span key={h} className="text-[9px] font-black text-indigo-400 bg-indigo-50/50 px-1.5 py-0.5 rounded-md uppercase">{h.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                        {turmas.find(t => t.id === plano.turmaId)?.nome?.charAt(0) || '?'}
                      </div>
                      <span className="text-slate-600 text-sm font-bold uppercase tracking-tighter">
                        {turmas.find(t => t.id === plano.turmaId)?.nome || 'Sem Turma'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {new Date(plano.data).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm", sc.cls)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-500 rounded-xl" onClick={(e) => { e.stopPropagation(); setPlanos(p => p.filter(x => x.id !== plano.id)); toast.success('Plano removido.'); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-6">
        {filtered.length > 0 ? filtered.map(plano => {
          const sc = statusConfig[plano.status];
          return (
            <Card key={plano.id} className="rounded-[2rem] border-slate-200/60 overflow-hidden shadow-lg shadow-slate-200/30">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={cn("h-6 rounded-lg text-[9px] font-black uppercase tracking-tighter border shadow-sm", sc.cls)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", sc.dot)} />
                        {sc.label}
                      </Badge>
                      <Badge variant="outline" className="h-6 rounded-lg text-[9px] font-black uppercase tracking-tighter text-slate-400 border-slate-200">
                        {turmas.find(t => t.id === plano.turmaId)?.nome || 'Sem Turma'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-serif font-black text-slate-900 leading-tight tracking-tight">{plano.titulo}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-slate-100">
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                      <DropdownMenuItem className="gap-3 py-3 font-bold text-slate-600 rounded-lg">
                        <Eye className="w-4 h-4" /> Abrir Roteiro
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 py-3 font-bold text-slate-600 rounded-lg">
                        <Pencil className="w-4 h-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 py-3 font-bold text-rose-500 rounded-lg hover:bg-rose-50" onClick={() => { setPlanos(p => p.filter(x => x.id !== plano.id)); toast.success('Plano removido.'); }}>
                        <Trash2 className="w-4 h-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-600 tabular-nums">{new Date(plano.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-tighter">{plano.habilidades?.split(',')[0].trim() ?? 'Pendente'}</span>
                  </div>
                </div>

                <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] gap-3">
                  Configurar Aula <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <FileText className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-600">Nenhum plano encontrado</p>
            <Button onClick={() => setOpen(true)} variant="ghost" className="text-primary font-bold">Criar o Primeiro</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
            <FileText className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <p className="font-serif font-black text-2xl text-slate-800">Canteiro Vazio</p>
            <p className="text-sm text-slate-500 font-medium">Nenhum roteiro corresponde aos seus filtros atuais.</p>
          </div>
          <Button variant="outline" className="mt-2 rounded-xl h-12 font-bold px-8 border-slate-200">Limpar Parâmetros</Button>
        </div>
      </td>
    </tr>
  );
}
