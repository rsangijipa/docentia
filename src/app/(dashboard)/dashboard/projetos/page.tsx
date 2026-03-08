'use client';

import * as React from 'react';
import {
  Rocket,
  Plus,
  Search,
  Users,
  Calendar,
  Sparkles,
  Layout,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Trash2,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import { toast } from 'sonner';
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
import { Label } from '@/components/ui/label';

export default function ProjetosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('ativos');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);

  const [newProject, setNewProject] = React.useState({
    titulo: '',
    status: 'planejamento',
    progresso: 0,
    turmas: [] as string[],
    dataInicio: '',
    dataFim: '',
    tema: '',
    colaboradores: 1
  });

  const { data: projetos = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => user?.id ? ProjectServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: turmas = [] } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ProjectServiceFB.create(data),
    onSuccess: () => {
      toast.success('Projeto criado com sucesso!');
      setIsCreateOpen(false);
      setNewProject({
        titulo: '',
        status: 'planejamento',
        progresso: 0,
        turmas: [],
        dataInicio: '',
        dataFim: '',
        tema: '',
        colaboradores: 1
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => toast.error('Erro ao criar projeto.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectServiceFB.delete(id),
    onSuccess: () => {
      toast.success('Projeto removido.');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => toast.error('Erro ao remover projeto.')
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    createMutation.mutate({
      ...newProject,
      teacherId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const filteredProjetos = projetos.filter((p: any) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-violet-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-violet-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Rocket className="w-4 h-4" />
            Aprendizagem Baseada em Projetos
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tight">Projetos</h1>
          <p className="text-violet-200/60 max-w-xl text-lg font-medium leading-relaxed">
            Planeje, execute e documente projetos interdisciplinares que transcendem a sala de aula tradicional.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold gap-2">
            <Layout className="w-5 h-5" /> Galeria Nacional
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-white text-violet-950 hover:bg-violet-100 font-bold gap-2 shadow-xl shadow-black/20 transition-all active:scale-95">
                <Plus className="w-5 h-5" /> Iniciar Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-xl p-0 overflow-hidden border-none shadow-3xl'>
              <DialogHeader className="bg-violet-950 text-white py-12 px-10 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-violet-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                    <Rocket className="w-4 h-4" /> Planejamento Estratégico
                  </div>
                  <DialogTitle className="text-white text-3xl italic">Novo Projeto</DialogTitle>
                  <DialogDescription className="text-violet-300 font-medium">Desenvolva uma trilha de aprendizagem interdisciplinar.</DialogDescription>
                </div>
              </DialogHeader>

              <form onSubmit={handleCreate} className="p-8 space-y-6">
                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Projeto</Label>
                    <Input
                      className="h-12 rounded-xl border-slate-200 font-bold"
                      placeholder="Ex: Feira de Sustentabilidade 2026"
                      value={newProject.titulo}
                      onChange={(e) => setNewProject({ ...newProject, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tema Central / Eixo</Label>
                    <Input
                      className="h-12 rounded-xl border-slate-200 font-bold"
                      placeholder="Ex: Ecologia Urbana e Reciclagem"
                      value={newProject.tema}
                      onChange={(e) => setNewProject({ ...newProject, tema: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className='space-y-2'>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data de Início</Label>
                      <Input
                        type="date"
                        className="h-12 rounded-xl border-slate-200 font-bold"
                        value={newProject.dataInicio}
                        onChange={(e) => setNewProject({ ...newProject, dataInicio: e.target.value })}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data de Encerramento</Label>
                      <Input
                        type="date"
                        className="h-12 rounded-xl border-slate-200 font-bold"
                        value={newProject.dataFim}
                        onChange={(e) => setNewProject({ ...newProject, dataFim: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 gap-3">
                  <Button type='button' variant='outline' onClick={() => setIsCreateOpen(false)} className="rounded-xl h-12 px-6">Cancelar</Button>
                  <Button
                    type='submit'
                    className="rounded-xl h-12 px-10 bg-violet-950 font-black uppercase tracking-widest text-[10px] gap-2"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lançar Projeto'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex p-1 bg-muted/40 rounded-2xl w-fit border border-border/50">
          {[
            { id: 'ativos', label: 'Projetos Ativos', icon: Clock },
            { id: 'templates', label: 'Meus Templates', icon: Layout },
            { id: 'arquivados', label: 'Histórico', icon: CheckCircle2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <Input
            placeholder="Buscar projetos ou temas..."
            className="pl-12 h-14 bg-white border-none shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-violet-500 rounded-2xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjetos.length > 0 ? filteredProjetos.map((proj: any) => (
          <Card key={proj.id} className="group hover:shadow-2xl transition-all duration-700 border-border/40 bg-white rounded-[2.5rem] overflow-hidden hover:border-violet-500/20 shadow-lg">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase tracking-widest border-none px-2 h-4",
                        proj.status === 'em-andamento' ? 'bg-blue-50 text-blue-600' :
                          proj.status === 'planejamento' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      )}>
                        {proj.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-violet-600 transition-colors">{proj.titulo}</h3>
                    <p className="text-xs text-muted-foreground font-medium italic">{proj.tema}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500 rounded-xl transition-all" onClick={() => setDeleteTarget(proj)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso Executivo</span>
                    <span className="text-xs font-bold text-slate-700">{proj.progresso}%</span>
                  </div>
                  <Progress value={proj.progresso} className="h-2 bg-slate-100 shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    {proj.turmas?.[0] || 'Sem Turma'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    {proj.dataFim ? formatDate(proj.dataFim) : 'S/ Data'}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-violet-50 transition-colors">
                <div className="flex -space-x-2">
                  {[1, 2].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">P</div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">+{proj.colaboradores || 0}</div>
                </div>
                <Button variant="ghost" className="text-[10px] font-black text-violet-600 gap-2 uppercase tracking-widest hover:bg-transparent hover:gap-3 transition-all">
                  Painel de Controle <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className='col-span-full py-32 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200'>
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
              <Rocket className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className='text-slate-500 font-bold'>Nenhum projeto lançado.</p>
              <p className="text-slate-400 text-xs">Transforme sua prática pedagógica iniciando um novo projeto.</p>
            </div>
          </div>
        )}

        <Card
          onClick={() => setIsCreateOpen(true)}
          className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-white hover:border-violet-500/40 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-violet-500 transition-colors border border-slate-100">
            <Plus className="w-6 h-6" />
          </div>
          <p className="mt-4 font-black text-slate-500 group-hover:text-violet-500 transition-colors uppercase tracking-widest text-xs">Novo Projeto</p>
          <p className="text-[10px] text-slate-400 font-medium italic">Modelo BP ou Livre</p>
        </Card>
      </div>

      <Card className="bg-slate-950 border-none text-white rounded-[3.5rem] p-12 relative overflow-hidden shadow-3xl mt-10">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-violet-500/10 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner">
            <Sparkles className="w-10 h-10 text-violet-400" />
          </div>
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h3 className="text-3xl font-serif font-black italic tracking-tight">Docentia AI Assistant</h3>
            <p className="text-slate-400 font-medium leading-relaxed italic text-lg">
              Identificamos uma oportunidade de projeto interdisciplinar para o 9º ano: <span className="text-white">&quot;Eco-Hackathon: Algoritmos para Sustentabilidade&quot;</span>.
            </p>
          </div>
          <Button className="bg-white text-slate-950 hover:bg-violet-500 hover:text-white font-black h-16 px-10 rounded-2xl gap-3 shadow-2xl transition-all uppercase tracking-widest text-[11px]">
            Explorar Roteiro <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
        title="Encerrar Projeto"
        description={deleteTarget ? `Tem certeza que deseja remover o projeto "${deleteTarget.titulo}"? Todos os diários vinculados serão preservados como histórico.` : ''}
        confirmLabel="Remover Permanente"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
