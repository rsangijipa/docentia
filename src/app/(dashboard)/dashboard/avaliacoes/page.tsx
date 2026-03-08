'use client';

import * as React from 'react';
import {
    CheckSquare,
    Search,
    Filter,
    Plus,
    MoreVertical,
    FileText,
    BarChart3,
    Calendar,
    Layers,
    Sparkles,
    ArrowUpRight,
    ChevronRight,
    Layout,
    Star,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function AvaliacoesPage() {
    const { turmas } = useMockData();
    const [activeTab, setActiveTab] = React.useState<'lista' | 'analytics' | 'config'>('lista');

    // Mock evaluations for internal display
    const avaliacoes = [
        {
            id: 'av-1',
            titulo: 'Avaliação de Álgebra - 1º Bimestre',
            turma: '8º Ano A',
            tipo: 'Prova',
            data: '15/03/2026',
            status: 'planejada',
            peso: 10,
            habilidades: ['EF08MA06', 'EF08MA07']
        },
        {
            id: 'av-2',
            titulo: 'Trabalho em Grupo: Geometria',
            turma: '9º Ano B',
            tipo: 'Projeto',
            data: '10/03/2026',
            status: 'corrigida',
            media: 8.2,
            peso: 5,
            habilidades: ['EF09MA15']
        },
        {
            id: 'av-3',
            titulo: 'Seminário: Lógica Computacional',
            turma: '7º Ano C',
            tipo: 'Atividade',
            data: '08/03/2026',
            status: 'em-correcao',
            peso: 3,
            habilidades: ['EF07MA01']
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <CheckSquare className="w-4 h-4" />
                        <span className="text-[10px] tracking-[0.2em] uppercase">Mensuração de Aprendizado</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
                        Centro de Avaliação
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Gerencie provas, trabalhos e rubricas com alinhamento total à BNCC e relatórios de desempenho.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2 font-bold bg-white rounded-xl">
                        <Layout className="w-4 h-4" /> Banco de Itens
                    </Button>
                    <Button className="flex-1 md:flex-none gap-2 shadow-lg shadow-primary/20 font-bold rounded-xl">
                        <Plus className="w-4 h-4" /> Criar Avaliação
                    </Button>
                </div>
            </div>

            {/* Tabs Custom */}
            <div className="flex p-1 bg-muted/40 rounded-2xl w-fit border border-border/50">
                {[
                    { id: 'lista', label: 'Avaliações', icon: Layers },
                    { id: 'analytics', label: 'Estatísticas', icon: BarChart3 },
                    { id: 'config', label: 'Configurações', icon: Star },
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

            {activeTab === 'lista' && (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-border/50 bg-white shadow-sm rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Próximas 48h</p>
                                <h4 className="text-xl font-bold">2 Avaliações</h4>
                            </div>
                        </Card>
                        <Card className="border-border/50 bg-white shadow-sm rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Em Correção</p>
                                <h4 className="text-xl font-bold">124 Provas</h4>
                            </div>
                        </Card>
                        <Card className="border-border/50 bg-white shadow-sm rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Média Geral</p>
                                <h4 className="text-xl font-bold text-emerald-600">7.8 / 10</h4>
                            </div>
                        </Card>
                    </div>

                    {/* Table / List */}
                    <Card className="border-border/50 bg-white rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/40 flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Buscar avaliações..." className="pl-10 h-10 bg-muted/20 border-border/50 rounded-xl" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-bold border-border/50 text-muted-foreground gap-2">
                                    <Filter className="w-4 h-4" /> Filtros
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
                                            <th className="px-6 py-4">Avaliação</th>
                                            <th className="px-6 py-4">Turma / Tipo</th>
                                            <th className="px-6 py-4">Data / Prazo</th>
                                            <th className="px-6 py-4">Status / Média</th>
                                            <th className="px-6 py-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {avaliacoes.map((av) => (
                                            <tr key={av.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{av.titulo}</p>
                                                        <div className="flex gap-1 mt-1">
                                                            {av.habilidades.map(h => (
                                                                <Badge key={h} className="text-[8px] font-bold bg-primary/5 text-primary border-primary/10">{h}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold">{av.turma}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{av.tipo}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-xs font-medium">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {av.data}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <Badge className={cn(
                                                            "w-fit text-[9px] font-bold h-5 uppercase tracking-tighter",
                                                            av.status === 'corrigida' ? 'bg-emerald-500' :
                                                                av.status === 'em-correcao' ? 'bg-amber-500' : 'bg-blue-500'
                                                        )}>{av.status}</Badge>
                                                        {av.media && (
                                                            <p className="text-[10px] font-bold text-emerald-600">Média: {av.media}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <div className="p-4 bg-muted/20 border-t border-border/50 text-center">
                            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">
                                Carregar mais avaliações
                            </Button>
                        </div>
                    </Card>

                    {/* Templates Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-serif font-bold">Assistente de Elaboração</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Prova BNCC', desc: 'Gerador de itens automáticos' },
                                { label: 'Rubrica Dinâmica', desc: 'Para projetos e seminários' },
                                { label: 'Autoavaliação', desc: 'Formulários socioemocionais' },
                                { label: 'Simulado Rede', desc: 'Padrão provas oficiais' },
                            ].map((item, i) => (
                                <Card key={i} className="p-5 hover:border-primary/50 cursor-pointer transition-all bg-white shadow-sm rounded-2xl group">
                                    <CardHeader className="p-0 pb-2">
                                        <CardTitle className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all mt-3 ml-auto" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <Card className="p-20 text-center border-dashed border-2 flex flex-col items-center gap-4 rounded-3xl">
                    <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
                    <div className="space-y-1">
                        <h3 className="text-xl font-serif font-bold">Analytics de Aprendizagem</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">Cruze os resultados das avaliações com as metas do Plano de Curso e cobertura da BNCC.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl px-8 font-bold">Processar Dados do Bimestre</Button>
                </Card>
            )}
        </div>
    );
}
