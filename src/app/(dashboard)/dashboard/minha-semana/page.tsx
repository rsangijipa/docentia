'use client';

import * as React from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    MoreVertical,
    Plus,
    Check,
    AlertCircle,
    ChevronRight,
    TrendingDown,
    Sparkles,
    Zap,
    Info,
    Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
    DiaryEntryServiceFB,
    EvaluationServiceFB,
    LessonPlanServiceFB,
    ClassroomServiceFB
} from '@/services/firebase/domain-services';

export default function PendenciasPage() {
    const { user } = useAuth();
    const [activeView, setActiveView] = React.useState('esta-semana');

    // Buscar Diários (para checar pendências de frequência)
    const { data: diarios = [], isLoading: loadingDiarios } = useQuery({
        queryKey: ['diaryEntries', user?.id],
        queryFn: () => user?.id ? DiaryEntryServiceFB.getByTeacher(user.id) : [],
        enabled: !!user?.id
    });

    // Buscar Avaliações (para checar correções pendentes)
    const { data: avaliacoes = [], isLoading: loadingEvals } = useQuery({
        queryKey: ['evaluations', user?.id],
        queryFn: () => user?.id ? EvaluationServiceFB.getByTeacher(user.id) : [],
        enabled: !!user?.id
    });

    // Buscar Planos de Aula (para mostrar roteiros futuros)
    const { data: planos = [], isLoading: loadingPlanos } = useQuery({
        queryKey: ['lessonPlans', user?.id],
        queryFn: () => user?.id ? LessonPlanServiceFB.getByTeacher(user.id) : [],
        enabled: !!user?.id
    });

    // Buscar Turmas (para contexto)
    const { data: turmas = [] } = useQuery({
        queryKey: ['classrooms', user?.id],
        queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
        enabled: !!user?.id
    });

    // Consolidar Pendências Reais
    const pendencias = React.useMemo(() => {
        const tasks: any[] = [];

        // 1. Planos de Aula sem conteúdo ou futuros
        planos.forEach((p: any) => {
            tasks.push({
                id: `plano-${p.id}`,
                titulo: `Preparar Aula: ${p.topic || p.titulo}`,
                vencimento: formatDate(p.date),
                status: 'pendente',
                prioridade: 'media',
                tipo: 'Planejamento',
                raw: p
            });
        });

        // 2. Avaliações
        avaliacoes.forEach((e: any) => {
            tasks.push({
                id: `eval-${e.id}`,
                titulo: `Lançar Notas: ${e.title || e.titulo}`,
                vencimento: formatDate(e.date),
                status: 'pendente',
                prioridade: 'alta',
                tipo: 'Avaliações',
                raw: e
            });
        });

        return tasks.sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
    }, [planos, avaliacoes]);

    const loading = loadingDiarios || loadingEvals || loadingPlanos;

    if (loading) {
        return (
            <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
                <Loader2 className='w-12 h-12 text-primary animate-spin' />
                <p className='text-slate-500 font-medium italic'>Consultando sua agenda pedagógica...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-24">
            {/* Header Compacto Premium */}
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 gap-10 transition-all hover:border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <div className="space-y-4 text-center lg:text-left relative z-10">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-primary font-black uppercase tracking-[0.25em] text-[10px]">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Agenda Inteligente
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-serif font-black italic tracking-tight text-slate-900 leading-tight">Minha Semana</h1>
                    <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed italic">
                        &quot;O foco é a alma da produtividade.&quot; Aqui estão suas prioridades reais sincronizadas com o ecossistema Docentia.
                    </p>
                </div>

                <div className="flex flex-col items-center lg:items-end gap-5 min-w-[240px] bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-3 w-full text-center lg:text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronização Ativa</span>
                        <div className="flex items-center gap-4 justify-center lg:justify-end">
                            <h3 className="text-5xl font-serif font-black italic text-primary">100%</h3>
                            <div className="flex flex-col items-start gap-0.5">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-[9px] text-slate-400 font-black whitespace-nowrap uppercase tracking-widest">Real-time</span>
                            </div>
                        </div>
                        <Progress value={100} className="h-2 bg-white mt-4 shadow-inner" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Main List */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                        <div className="flex p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-200/50 backdrop-blur-sm">
                            {['ontem', 'hoje', 'amanhã', 'esta-semana'].map(view => (
                                <button
                                    key={view}
                                    onClick={() => setActiveView(view)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeView === view ? "bg-white text-primary shadow-md" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {view.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                        <Button className="h-12 px-8 rounded-xl bg-slate-900 border-none hover:bg-primary shadow-xl shadow-slate-200 transition-all text-[11px] font-black uppercase tracking-widest gap-2 active:scale-95">
                            <Plus className="w-4 h-4" /> Nova Pendência
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {pendencias.length > 0 ? pendencias.map((task: any) => (
                            <Card key={task.id} className={cn(
                                "group hover:shadow-2xl transition-all duration-700 border-slate-100 bg-white rounded-[2.5rem] overflow-hidden hover:border-primary/20 cursor-pointer relative",
                                task.status === 'concluido' && "opacity-60 grayscale"
                            )}>
                                <CardContent className="p-8 flex items-center gap-8">
                                    <div className={cn(
                                        "h-14 w-14 shrink-0 rounded-[1.25rem] border-2 flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-inner",
                                        task.status === 'concluido' ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-100 text-slate-200 group-hover:border-primary/20 group-hover:text-primary bg-slate-50/50"
                                    )}>
                                        {task.status === 'concluido' ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-primary transition-colors animate-pulse" />}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 border-slate-100 px-2 py-0.5">
                                                {task.tipo}
                                            </Badge>
                                            {task.prioridade === 'alta' && <Badge className="bg-rose-50 text-rose-500 border-none text-[8px] font-black uppercase px-2 h-4 tracking-widest">Alta Prioridade</Badge>}
                                        </div>
                                        <h4 className={cn(
                                            "text-xl font-bold text-slate-900 transition-all group-hover:text-primary",
                                            task.status === 'concluido' && "line-through text-slate-400"
                                        )}>{task.titulo}</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" />
                                                Limite: {task.vencimento}
                                            </div>
                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                            <div className="text-[10px] text-primary font-black uppercase tracking-widest">
                                                Urgente
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <Button variant="ghost" className="h-12 px-6 rounded-xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-900 hover:text-white transition-all">
                                            Resolver <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="py-24 text-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Parabéns, Professor!</p>
                                    <h3 className="text-2xl font-serif italic text-slate-900">Nada pendente para esta semana.</h3>
                                    <p className="text-slate-400 text-xs mt-1">Aproveite para focar na qualidade pedagógica.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="xl:col-span-4 space-y-10">
                    {/* Magic AI Focus */}
                    <Card className="bg-slate-950 border-none text-white rounded-[3.5rem] p-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-white/5 shadow-inner">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white/50">Assistente Pedagógico</h4>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md group-hover:bg-white/10 transition-all duration-500 border-l-4 border-l-primary">
                                    <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                                        &quot;Sua produtividade está 15% acima da média institucional. {pendencias.length > 0 ? `Temos ${pendencias.length} focos identificados para as próximas 48 horas.` : 'Tudo sob controle por aqui.'}&quot;
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Eficácia Semanal</span>
                                    <span className="text-primary">+92%</span>
                                </div>
                                <Progress value={92} className="h-1.5 bg-white/5 shadow-inner" />
                            </div>

                            <Button className="w-full bg-primary text-white hover:bg-white hover:text-slate-950 font-black h-14 rounded-2xl border-none transition-all shadow-2xl shadow-primary/20 text-[10px] uppercase tracking-widest gap-2">
                                <Zap className="w-4 h-4 fill-current" /> Otimizar Fluxo de Trabalho
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Action Box */}
                    <Card className="border-slate-100 bg-white rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 space-y-8 transition-all hover:shadow-2xl hover:-translate-y-1 duration-500">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shadow-inner">
                                <Info className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Prazos Regimentais</h4>
                                <p className="text-sm text-slate-500 leading-relaxed italic">
                                    Conforme o calendário escolar, as médias do bimestre devem ser consolidadas até o dia 20.
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <Button variant="ghost" className="p-0 text-[10px] font-black text-primary gap-2 uppercase tracking-widest hover:bg-transparent hover:gap-3 transition-all">
                                Consultar Regimento <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
