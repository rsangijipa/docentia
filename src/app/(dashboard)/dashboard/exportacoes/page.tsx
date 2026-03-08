'use client';

import * as React from 'react';
import {
    FileUp,
    Download,
    Clock,
    Search,
    FileText,
    FileSpreadsheet,
    FileTerminal,
    MoreVertical,
    CheckCircle2,
    Trash2,
    Share2,
    ExternalLink,
    Plus,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function ExportacoesPage() {
    const { exports } = useMockData();
    const [activeTab, setActiveTab] = React.useState<'recentes' | 'agendadas' | 'templates'>('recentes');

    const getFileIcon = (tipo: string) => {
        switch (tipo) {
            case 'pdf': return <FileText className="w-6 h-6 text-rose-500" />;
            case 'excel': return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
            case 'csv': return <FileTerminal className="w-6 h-6 text-slate-600" />;
            default: return <FileText className="w-6 h-6 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <FileUp className="w-4 h-4" />
                        <span className="text-[10px] tracking-[0.2em] uppercase">Documentação Consolidada</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
                        Exportações
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Acesse todos os documentos gerados pelo sistema: diários, relatórios de conselho, atas e pareceres.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-2xl gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Nova Exportação
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Files List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex p-1 bg-muted/40 rounded-xl w-fit border border-border/50">
                            {['recentes', 'agendadas', 'templates'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "px-6 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                                        activeTab === tab ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input placeholder="Filtrar arquivos..." className="pl-9 h-9 w-48 bg-white rounded-xl text-xs" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {exports.map((file) => (
                            <Card key={file.id} className="group hover:shadow-md transition-all border-border/40 bg-white rounded-2xl overflow-hidden hover:border-primary/20 cursor-pointer">
                                <CardContent className="p-5 flex items-center gap-5">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                                        {getFileIcon(file.tipo)}
                                    </div>
                                    <div className="flex-1 space-y-0.5 min-w-0">
                                        <h4 className="font-bold text-sm text-foreground truncate">{file.arquivo}</h4>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            <span>{file.data}</span>
                                            <span>•</span>
                                            <span>{file.tamanho}</span>
                                            <span>•</span>
                                            <Badge variant="success" className="h-4 font-bold rounded-md bg-emerald-50 text-emerald-600 border-none px-1.5">{file.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenuSimple />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button variant="ghost" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.2em] gap-2">
                            Ver histórico completo <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Right Content: Storage & Quick Reports */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Storage Pulse */}
                    <Card className="border-border/50 bg-slate-900 border-none text-white rounded-[2.5rem] p-8 shadow-xl">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Armazenamento</p>
                                    <h3 className="text-2xl font-serif font-bold text-primary">Próximo do Limite</h3>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>82.4 MB utilizados</span>
                                    <span className="text-zinc-400">100 MB</span>
                                </div>
                                <Progress value={82} className="h-2 bg-white/10" />
                                <p className="text-[10px] text-zinc-500 font-medium">Arquivos expiram automaticamente após 30 dias.</p>
                            </div>

                            <Button className="w-full bg-white text-slate-900 hover:bg-primary hover:text-white font-bold h-11 rounded-xl transition-all">
                                Migrar para Cloud Premium
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Generate Panel */}
                    <Card className="border-border/40 bg-white rounded-[2.5rem] overflow-hidden shadow-sm">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gerar Agora</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-3">
                            {[
                                { label: 'Relatório Bimestral', sub: 'Todas as turmas' },
                                { label: 'Ata de Resultados', sub: '9º Ano B' },
                                { label: 'Mapa de Frequência', sub: 'Consolidação mensal' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div>
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DropdownMenuSimple() {
    return (
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground">
            <MoreVertical className="w-4 h-4" />
        </Button>
    );
}
