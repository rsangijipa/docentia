'use client';

import * as React from 'react';
import {
  Rocket,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  Target,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Layout,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function ProjetosPage() {
  const [activeTab, setActiveTab] = React.useState('ativos');

  const projetos = [
    {
      id: 1,
      titulo: 'Feira de Ciências 2026',
      status: 'em-andamento',
      progresso: 65,
      turmas: ['8º Ano A', '8º Ano B'],
      dataInicio: '01/03/2026',
      dataFim: '15/05/2026',
      tema: 'Sustentabilidade Urbana',
      colaboradores: 4
    },
    {
      id: 2,
      titulo: 'Semana de Robótica',
      status: 'planejamento',
      progresso: 20,
      turmas: ['9º Ano C'],
      dataInicio: '10/04/2026',
      dataFim: '17/04/2026',
      tema: 'Inovação e Sociedade',
      colaboradores: 2
    },
    {
      id: 3,
      titulo: 'Antologia Poética',
      status: 'concluido',
      progresso: 100,
      turmas: ['7º Ano A'],
      dataInicio: '10/02/2026',
      dataFim: '05/03/2026',
      tema: 'Expressão Artística',
      colaboradores: 1
    }
  ];

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
          <Button className="h-14 px-8 rounded-2xl bg-white text-violet-950 hover:bg-violet-100 font-bold gap-2 shadow-xl shadow-black/20 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Iniciar Projeto
          </Button>
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
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
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

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar projetos..." className="pl-10 h-11 bg-white border-border/60 rounded-xl" />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projetos.map((proj: any) => (
          <Card key={proj.id} className="group hover:shadow-2xl transition-all duration-500 border-border/40 bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "text-[8px] font-bold uppercase tracking-widest border-none px-2",
                        proj.status === 'em-andamento' ? 'bg-blue-100 text-blue-700' :
                          proj.status === 'planejamento' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      )}>
                        {proj.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{proj.titulo}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{proj.tema}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Progresso Global</span>
                    <span className="text-xs font-bold text-slate-700">{proj.progresso}%</span>
                  </div>
                  <Progress value={proj.progresso} className="h-2 bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {proj.turmas[0]} {proj.turmas.length > 1 && `+${proj.turmas.length - 1}`}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Encerrra {proj.dataFim.split('/')[0]}/{proj.dataFim.split('/')[1]}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">P</div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">+{proj.colaboradores}</div>
                </div>
                <Button variant="ghost" className="text-[10px] font-bold text-primary gap-1 uppercase tracking-widest hover:bg-transparent">
                  Acessar Painel <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* New Project Card */}
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-white hover:border-primary/40 transition-all cursor-pointer group">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors border border-slate-100">
            <Plus className="w-6 h-6" />
          </div>
          <p className="mt-4 font-bold text-slate-500 group-hover:text-primary transition-colors">Criar Novo Projeto</p>
          <p className="text-[10px] text-slate-400 font-medium">Use um modelo ou comece do zero</p>
        </Card>
      </div>

      {/* AI Assistant Banner */}
      <Card className="bg-slate-900 border-none text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl mt-8">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/20 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold italic">Docentia AI: Sugestão de Projeto</h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Identificamos que as turmas do 9º ano estão estudando &quot;Impactos da Revolução Industrial&quot;. Que tal um projeto interdisciplinar focando em <span className="text-white italic">&quot;Eco-Hackathon: Soluções Digitais para Resíduos&quot;</span>?
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl gap-2 shadow-lg shadow-primary/20">
            Ver Estrutura <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
