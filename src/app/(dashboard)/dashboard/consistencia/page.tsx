'use client';

import * as React from 'react';
import {
    Zap,
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    ArrowRight,
    Search,
    ExternalLink,
    ShieldCheck,
    RefreshCcw,
    Sparkles,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function ConsistenciaPage() {
    const { inconsistencies, recommendations } = useMockData();
    const [scanning, setScanning] = React.useState(false);

    const startScan = () => {
        setScanning(true);
        setTimeout(() => setScanning(false), 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Auditor */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/20 blur-[80px] rounded-full -ml-10 -mb-10" />

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] tracking-[0.3em] uppercase">Auditor Pedagógico IA</span>
                    </div>
                    <h1 className="text-5xl font-serif font-bold tracking-tight">
                        Consistência
                    </h1>
                    <p className="text-zinc-400 max-w-xl text-lg">
                        Nossa inteligência analisa seus planos, diários e avaliações para garantir o cumprimento da BNCC e do Plano de Curso.
                    </p>
                </div>
                <div className="relative z-10">
                    <Button
                        disabled={scanning}
                        onClick={startScan}
                        className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-primary/20 text-md scale-105 transition-transform"
                    >
                        {scanning ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                        {scanning ? 'Auditando...' : 'Iniciar Auditoria Global'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Inconsistencies */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold font-serif flex items-center gap-3">
                            Inconsistências Detectadas
                            <Badge variant="outline" className="h-6 rounded-lg bg-rose-50 text-rose-600 border-rose-100 font-bold">{inconsistencies.length}</Badge>
                        </h2>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-primary">Limpar Resolvidos</Button>
                    </div>

                    <div className="space-y-4">
                        {inconsistencies.map((inc) => (
                            <Card key={inc.id} className="group hover:shadow-lg transition-all border-border/50 bg-white rounded-[2rem] overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={cn(
                                            "w-2 shrink-0 h-auto",
                                            inc.gravidade === 'critica' ? 'bg-rose-500' :
                                                inc.gravidade === 'moderada' ? 'bg-amber-500' : 'bg-blue-500'
                                        )} />
                                        <div className="flex-1 p-6 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-widest">{inc.modulo}</Badge>
                                                        <Badge className={cn(
                                                            "text-[8px] font-bold uppercase tracking-widest bg-transparent border-none",
                                                            inc.gravidade === 'critica' ? 'text-rose-500' : 'text-amber-600'
                                                        )}>Gravidade: {inc.gravidade}</Badge>
                                                    </div>
                                                    <h4 className="text-base font-bold text-foreground">{inc.descricao}</h4>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <Button variant="outline" className="h-9 px-5 rounded-xl text-xs font-bold border-border/60 hover:bg-slate-50 gap-2">
                                                    Por que isso é um erro? <HelpCircle className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button className="h-9 px-5 rounded-xl text-xs font-bold bg-slate-900 border-none gap-2">
                                                    Corrigir Agora <ArrowRight className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Alert className="bg-emerald-50 border-emerald-100 rounded-3xl p-6">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <AlertTitle className="text-emerald-800 font-bold mb-1">Tudo Pronto no Calendário!</AlertTitle>
                        <AlertDescription className="text-emerald-700 text-xs">
                            Não encontramos buracos de planejamento no Calendário Escolar para o mês atual.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Right: Recommendations AI */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                        <h2 className="text-xl font-bold font-serif">Otimização IA</h2>
                    </div>

                    <div className="space-y-4">
                        {recommendations.map((rec) => (
                            <Card key={rec.id} className="border-border/50 bg-white group hover:border-violet-300 transition-all rounded-[2rem] overflow-hidden shadow-sm">
                                <CardHeader className="p-6 border-b border-border/40 flex-row items-center justify-between space-y-0 bg-violet-50/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </div>
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{rec.titulo}</CardTitle>
                                    </div>
                                    <Badge className={cn(
                                        "font-bold text-[9px] uppercase border-none",
                                        rec.prioridade === 'alta' ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-600'
                                    )}>{rec.prioridade}</Badge>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.descricao}</p>
                                    <Button className="w-full h-11 rounded-1.5xl bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white border-none font-bold gap-2 transition-all">
                                        {rec.actionLabel} <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-blue-900 border-none text-white rounded-[2rem] p-8 space-y-4 shadow-xl">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Info className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold">Como funciona a Auditoria?</h4>
                        </div>
                        <p className="text-xs text-blue-200 leading-relaxed">
                            Nosso motor de regras verifica se o número de aulas registradas bate com o plano de curso e se as competências da BNCC estão sendo cobertas uniformemente ao longo do ano.
                        </p>
                        <Button variant="link" className="text-white p-0 text-xs font-bold gap-2">
                            Entenda as métricas de conformidade <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
