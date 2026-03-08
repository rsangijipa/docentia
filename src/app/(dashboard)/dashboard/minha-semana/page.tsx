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
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function PendenciasPage() {
    const [activeView, setActiveView] = React.useState('hoje');

    const pendencias = [
        {
            id: 1,
            titulo: 'Lançar Frequência: 8º Ano A',
            vencimento: 'Hoje, 18:00',
            status: 'pendente',
            prioridade: 'alta',
            tipo: 'Diário de Classe'
        },
        {
            id: 2,
            titulo: 'Corrigir Provas: 9º Ano B',
            vencimento: 'Hoje, 23:59',
            status: 'pendente',
            prioridade: 'media',
            tipo: 'Avaliações'
        },
        {
            id: 3,
            titulo: 'Finalizar Plano de Aula: Semana 12',
            vencimento: 'Amanhã',
            status: 'concluido',
            prioridade: 'alta',
            tipo: 'Planejamento'
        },
        {
            id: 4,
            titulo: 'Relatório Individual: Aluno João P.',
            vencimento: '15 de Março',
            status: 'pendente',
            prioridade: 'critica',
            tipo: 'Conselho'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Compacto Premium */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-12 rounded-[3.5rem] border border-border/50 shadow-sm gap-8 transition-all hover:border-primary/20">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
                        <Calendar className="w-4 h-4" />
                        Agenda Pedagógica
                    </div>
                    <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground">Minha Semana</h1>
                    <p className="text-muted-foreground max-w-lg text-lg font-medium leading-relaxed">
                        Sua central de produtividade. Foque no que importa hoje e deixe as notificações inteligentes gerenciarem o resto.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                    <div className="space-y-2 w-full text-center md:text-right">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Produtividade Semanal</span>
                        <div className="flex items-center gap-4 justify-center md:justify-end">
                            <h3 className="text-4xl font-serif font-bold text-primary">82%</h3>
                            <div className="flex flex-col items-start gap-0.5">
                                <TrendingDown className="w-4 h-4 text-rose-500" />
                                <span className="text-[10px] text-zinc-400 font-bold whitespace-nowrap">-2% vs ontem</span>
                            </div>
                        </div>
                        <Progress value={82} className="h-2 bg-slate-100 mt-2" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main List */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex p-1 bg-muted/40 rounded-2xl w-fit border border-border/50">
                            {['ontem', 'hoje', 'amanhã', 'esta-semana'].map(view => (
                                <button
                                    key={view}
                                    onClick={() => setActiveView(view)}
                                    className={cn(
                                        "px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize",
                                        activeView === view ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {view.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                        <Button size="icon" className="h-10 w-10 rounded-xl bg-slate-900 border-none hover:bg-primary shadow-lg transition-all text-white active:scale-95">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {pendencias.map((task) => (
                            <Card key={task.id} className={cn(
                                "group hover:shadow-xl transition-all duration-500 border-border/40 bg-white rounded-[2rem] overflow-hidden hover:border-primary/30 cursor-pointer",
                                task.status === 'concluido' && "opacity-60 saturate-50"
                            )}>
                                <CardContent className="p-6 flex items-center gap-6">
                                    <button className={cn(
                                        "h-10 w-10 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90",
                                        task.status === 'concluido' ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 text-slate-200 hover:border-primary group-hover:text-primary"
                                    )}>
                                        {task.status === 'concluido' ? <Check className="w-5 h-5" /> : <div className="w-5 h-5" />}
                                    </button>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground border-slate-200">
                                                {task.tipo}
                                            </Badge>
                                            {task.prioridade === 'alta' && <Badge className="bg-rose-100 text-rose-600 border-none text-[8px] font-bold uppercase px-1.5 h-4">Alta</Badge>}
                                            {task.prioridade === 'critica' && <Badge className="bg-rose-600 text-white border-none text-[8px] font-bold uppercase px-1.5 h-4 flex gap-1 shadow-lg shadow-rose-200"> <AlertCircle className="w-2.5 h-2.5" /> Crítica</Badge>}
                                        </div>
                                        <h4 className={cn(
                                            "text-lg font-bold text-slate-800 transition-all",
                                            task.status === 'concluido' && "line-through text-slate-400"
                                        )}>{task.titulo}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            Previsão: {task.vencimento}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" className="text-primary font-bold text-xs gap-1 hover:bg-transparent">
                                            Resolver <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Magic AI Focus */}
                    <Card className="bg-slate-900 border-none text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-bold uppercase tracking-widest">Foco do Dia IA</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                                    <p className="text-sm font-medium leading-relaxed">
                                        "O conselho da Turma 8º A será na quarta-feira. Priorize o relatório do João P. para evitar pendências no dia."
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 pt-2">
                                    <span>Economia de Tempo Estimada</span>
                                    <span className="text-primary">+45 min</span>
                                </div>
                                <Progress value={90} className="h-1 bg-white/10" />
                            </div>

                            <Button className="w-full bg-primary text-white hover:bg-white hover:text-slate-900 font-bold h-12 rounded-xl border-none transition-all shadow-xl shadow-primary/20">
                                <Zap className="w-4 h-4 fill-current mr-2" /> Otimizar Roteiro
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Action Box */}
                    <Card className="border-border/50 bg-white rounded-[3rem] p-8 shadow-sm space-y-6 transition-all hover:shadow-xl">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Info className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-800">Sobre os Prazos</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Prazos mostrados em vermelho são regulamentares da escola e podem impactar no fechamento do bimestre.
                            </p>
                        </div>
                        <Button variant="link" className="p-0 text-xs font-bold text-primary gap-1">Entenda as regras de prazos <ChevronRight className="w-3.5 h-3.5" /></Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
