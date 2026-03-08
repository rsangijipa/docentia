'use client';

import * as React from 'react';
import {
    FileText,
    Download,
    Eye,
    Search,
    Clock,
    Star,
    Filter,
    Plus,
    Layout,
    BarChart3,
    FileSpreadsheet,
    FileJson,
    CheckCircle2,
    Calendar,
    MoreVertical,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMockData } from '@/hooks/use-mock-data';
import { toast } from 'sonner';

export default function RelatoriosPage() {
    const { templates } = useMockData();
    const [generating, setGenerating] = React.useState<string | null>(null);

    const handleGenerate = (id: string, name: string) => {
        setGenerating(id);
        toast.info(`Gerando relatório: ${name}...`);

        // Simulate generation
        setTimeout(() => {
            setGenerating(null);
            toast.success(`${name} gerado com sucesso!`);
        }, 2000);
    };

    const reportTypes = [
        { title: 'Plano de Curso', icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Estrutura anual/bimestral completa.' },
        { title: 'Diário Consolidado', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Frequência e conteúdos ministrados.' },
        { title: 'Parecer Descritivo', icon: FileSpreadsheet, color: 'text-violet-600', bg: 'bg-violet-50', desc: 'Avaliação individual detalhada.' },
        { title: 'Relatório de Turma', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Desempenho e métricas coletivas.' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm tracking-wide uppercase">Inteligência de Dados</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
                        Central de Relatórios
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Gere documentos oficiais, analise o progresso das turmas e exporte dados para PDF ou Excel.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2">
                        <Clock className="w-4 h-4" />
                        Histórico
                    </Button>
                    <Button className="flex-1 md:flex-none gap-2 bg-slate-800 hover:bg-slate-900 shadow-sm text-white border-transparent">
                        <Plus className="w-4 h-4" />
                        Novo Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Generate Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reportTypes.map((type, i) => (
                            <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer overflow-hidden border-border/50">
                                <CardContent className="p-0 flex h-full">
                                    <div className={`w-16 ${type.bg} flex items-center justify-center border-r border-border/40 group-hover:bg-primary group-hover:text-white transition-colors`}>
                                        <type.icon className={`w-7 h-7 ${type.color} group-hover:text-white transition-colors`} />
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-base mb-1">{type.title}</h4>
                                            <p className="text-xs text-muted-foreground">{type.desc}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold">PDF / XLSX</Badge>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 p-0 text-primary hover:bg-transparent" onClick={() => handleGenerate(type.title, type.title)}>
                                                Gerar Agora <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Templates Gallery */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                                <Layout className="w-5 h-5 text-primary" />
                                Galeria de Templates
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input placeholder="Buscar template..." className="h-9 w-48 pl-9 text-xs" />
                                </div>
                                <Button variant="outline" size="sm" className="h-9"><Filter className="w-3.5 h-3.5 mr-2" /> Filtros</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {templates.map((template) => (
                                <div key={template.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <FileJson className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold">{template.nome}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{template.tipo}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground">
                                            <Eye className="w-4 h-4" /> Preview
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 px-3 gap-2 border-border/60 hover:border-primary/30"
                                            disabled={generating === template.id}
                                            onClick={() => handleGenerate(template.id, template.nome)}
                                        >
                                            {generating === template.id ? (
                                                <Clock className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                            Gerar
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <Star className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Recent & Favorites */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Gerados Recentemente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                {[
                                    { name: 'Diário 8ºA - Sem 12', date: 'Hoje, 09:40', type: 'PDF' },
                                    { name: 'Plano Anual 2024 V2', date: 'Ontem', type: 'DOCX' },
                                    { name: 'Lista de Chamada 9ºB', date: 'Há 2 dias', type: 'XLSX' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/10 group cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{item.date} · {item.type}</p>
                                            </div>
                                        </div>
                                        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-3 bg-muted/20 border-t border-border/50 text-center">
                            <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                                Ver histórico completo
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Star className="w-5 h-5 fill-primary" />
                                </div>
                                <h3 className="font-bold text-sm">Templates Favoritos</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">Acesse rapidamente os documentos que você mais utiliza no dia a dia.</p>
                            <div className="space-y-2">
                                {['Plano de Aula Semanal', 'Parecer Bimestral 2024'].map((fav, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white border border-primary/10 p-3 rounded-xl hover:shadow-sm transition-all cursor-pointer">
                                        <span className="text-xs font-medium">{fav}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/50 bg-slate-900 text-white">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Próximas Entregas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {[
                                { title: 'Fechamento 1º Bimestre', date: 'Em 12 dias', urgent: true },
                                { title: 'Relatório de Atividades PNLD', date: '30 de Março', urgent: false },
                            ].map((task, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${task.urgent ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                                    <div>
                                        <p className="text-xs font-bold">{task.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{task.date}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="link" className="px-0 h-auto text-[10px] font-bold text-primary uppercase group">
                                Ver cronograma de relatórios <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
