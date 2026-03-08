'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  Calendar,
  School,
  Activity,
  Zap,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  Loader2,
  TrendingUp,
  FileSpreadsheet,
  Trash2,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ClassroomServiceFB } from '@/services/firebase/domain-services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function TurmasPage() {
  const { user } = useAuth();
  const [turmas, setTurmas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Form State
  const [newTurma, setNewTurma] = React.useState({
    nome: '',
    serie: '',
    turno: 'matutino'
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchTurmas = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await ClassroomServiceFB.getByTeacher(user.id);
      setTurmas(data);
    } catch (err) {
      toast.error("Falha ao sincronizar ecossistema de turmas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja descontinuar a turma ${nome}? Esta ação é irreversível no ecossistema.`)) return;

    try {
      await ClassroomServiceFB.delete(id);
      toast.success(`Turma ${nome} removida com sucesso.`);
      fetchTurmas();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir turma.");
    }
  };

  React.useEffect(() => {
    if (user?.id) fetchTurmas();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      await ClassroomServiceFB.create({
        ...newTurma,
        teacherId: user.id,
        createdAt: new Date().toISOString()
      });
      toast.success(`Turma ${newTurma.nome} lançada com sucesso.`);
      setIsCreateOpen(false);
      setNewTurma({ nome: '', serie: '', turno: 'matutino' });
      fetchTurmas();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar turma.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = turmas.filter(t =>
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando ecossistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header Premium */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-1">
            <School className="w-4 h-4" />
            Gestão de Ambientes
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 leading-none italic">Minhas Turmas</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base font-medium max-w-xl italic">
            Gerencie o fluxo de enturmação e métricas de desempenho coletivo em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="h-14 flex-1 sm:flex-none rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-300" /> Exportar
          </Button>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 flex-1 sm:flex-none rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-slate-200 border-none transition-all hover:scale-105 active:scale-95 leading-none">
                <Plus className="w-5 h-5" /> Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <form onSubmit={handleCreate}>
                <div className="p-10 space-y-8">
                  <DialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-4 shadow-lg italic font-serif font-black text-xl">D</div>
                    <DialogTitle className="text-3xl font-serif font-black italic tracking-tight text-slate-900">Lançar Nova Turma</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium italic">
                      Preencha os dados básicos para integrar este novo ambiente ao seu ecossistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Turma</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: 8º Ano A"
                        className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold focus:ring-primary/10"
                        value={newTurma.nome}
                        onChange={e => setNewTurma({ ...newTurma, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serie" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Série / Ciclo</Label>
                        <Input
                          id="serie"
                          placeholder="Ex: 8º Ano"
                          className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold focus:ring-primary/10"
                          value={newTurma.serie}
                          onChange={e => setNewTurma({ ...newTurma, serie: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="turno" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Turno</Label>
                        <select
                          id="turno"
                          className="w-full h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
                          value={newTurma.turno}
                          onChange={e => setNewTurma({ ...newTurma, turno: e.target.value })}
                        >
                          <option value="matutino">Matutino</option>
                          <option value="vespertino">Vespertino</option>
                          <option value="noturno">Noturno</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 sm:p-10 mt-0">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl font-bold text-slate-400">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-slate-200 border-none transition-all hover:scale-105">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Confirmar Lançamento
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Pesquisar ecossistema..."
            className="pl-14 h-16 bg-white border-slate-200/60 rounded-[1.5rem] shadow-xl shadow-slate-100/50 text-base font-medium transition-all focus:ring-4 focus:ring-primary/5 outline-none font-serif italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-16 flex-1 sm:flex-none px-8 rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest gap-3">
            <Filter className="w-4 h-4 text-slate-300" /> Filtros
          </Button>
          <div className="hidden sm:flex h-16 p-1 bg-slate-100 rounded-2xl border border-slate-200/50">
            <button onClick={() => setViewMode('grid')} className={cn("px-4 rounded-xl transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-slate-400")}>
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={cn("px-4 rounded-xl transition-all", viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-slate-400")}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Turmas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((turma) => (
          <Card key={turma.id} className="group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden shadow-sm relative border-t-0">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-indigo-500 opacity-80" />

            <CardContent className="p-0">
              <div className="p-8 sm:p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase px-2 h-5 tracking-widest">{turma.turno}</Badge>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-slate-100 px-2 h-5">{turma.serie}</Badge>
                    </div>
                    <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight mt-1 group-hover:text-primary transition-colors italic leading-none">{turma.nome}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shadow-inner group-hover:shadow-xl group-hover:shadow-primary/20">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50">
                    <Settings className="w-3.5 h-3.5 mr-1.5" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(turma.id, turma.nome)}
                    className="h-10 w-10 rounded-xl text-rose-300 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={2.5} />
                      <span>{turma.alunos?.length || 0} Estudantes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <Activity className="w-3.5 h-3.5" />
                      92%
                    </div>
                  </div>
                  <Progress value={92} className="h-2 bg-slate-100" />
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-4 h-4 text-slate-300" />
                  {turma.subject?.name || 'Disciplina'}
                </div>
                <Link href={`/dashboard/turmas/${turma.id}`}>
                  <Button variant="ghost" className="h-10 text-[10px] font-black text-primary gap-2 uppercase tracking-[0.15em] hover:bg-transparent p-0">
                    Gerenciar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Card Placeholder */}
        <button onClick={() => setIsCreateOpen(true)} className="w-full">
          <Card className="h-full border-dashed border-2 border-slate-200 bg-slate-50/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-white hover:border-primary/40 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-200 group-hover:text-primary group-hover:border-primary transition-all border border-slate-100 group-hover:scale-110 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] animate-pulse group-hover:opacity-0 transition-opacity" />
              <Plus className="w-8 h-8 relative z-10" />
            </div>
            <p className="mt-5 font-black text-slate-400 group-hover:text-primary transition-colors tracking-[0.2em] uppercase text-[10px]">Lançar Nova Turma</p>
            <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">Ciclo Letivo 2026</p>
          </Card>
        </button>
      </div>

      {filtered.length === 0 && !loading && (
        <div className="py-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-serif font-black italic text-slate-400">Nenhuma turma encontrada.</h3>
          <p className="text-slate-300 font-bold uppercase text-[10px] mt-2 tracking-widest">Inicie o lançamento para começar a gerenciar.</p>
        </div>
      )}
    </div>
  );
}
