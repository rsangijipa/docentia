'use client';

import * as React from 'react';
import {
    FileText,
    MoreVertical,
    Plus,
    Search,
    Filter,
    Layout,
    Eye,
    Copy,
    Edit3,
    Trash2,
    Settings2,
    FileBadge,
    Sparkles,
    Zap,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function TemplatesPage() {
    const { templates } = useMockData();
    const [activeCategory, setActiveCategory] = React.useState('Todos');

    const categories = ['Todos', 'Relatórios', 'Diários', 'Atas', 'Certificados'];

    const filteredTemplates = templates.filter(t =>
        activeCategory === 'Todos' || t.category === activeCategory
    );

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-100 p-12 rounded-[3.5rem] border border-border/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-200/50 blur-[100px] rounded-full -mr-20 -mt-20" />

                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                        <Layout className="w-4 h-4" />
                        Engenharia de Documentação
                    </div>
                    <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground">Biblioteca de Templates</h1>
                    <p className="text-muted-foreground max-w-xl text-lg font-medium leading-relaxed">
                        Padronize a comunicação da sua escola com modelos inteligentes de relatórios, diários e atas pedagógicas.
                    </p>
                </div>

                <div className="relative z-10">
                    <Button className="h-14 px-8 rounded-2xl bg-slate-900 border-none hover:bg-primary hover:text-white font-bold gap-3 shadow-xl shadow-black/10 transition-all text-white">
                        <Plus className="w-5 h-5" /> Novo Template
                    </Button>
                </div>
            </div>

            {/* Categories & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap p-1 bg-muted/40 rounded-2xl w-fit border border-border/50">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                                activeCategory === cat
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar modelos..." className="pl-10 h-11 bg-white border-border/60 rounded-xl" />
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-2xl transition-all duration-500 border-border/40 bg-white rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            <FileBadge className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-slate-200">
                                        {template.category}
                                    </Badge>
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{template.name}</h3>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{template.description}</p>
                                </div>

                                <div className="flex gap-2">
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[8px] uppercase px-2 shadow-none">PDF</Badge>
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[8px] uppercase px-2 shadow-none flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5 fill-current" />
                                        Preenchimento IA
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-4 bg-slate-50 border-t border-slate-100 group-hover:bg-primary/5 transition-colors">
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary transition-colors rounded-xl mx-auto">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary transition-colors rounded-xl mx-auto">
                                    <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary transition-colors rounded-xl mx-auto">
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 transition-colors rounded-xl mx-auto">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Empty State / Add Card */}
                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/30 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-white hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-200 group-hover:text-primary transition-colors border border-slate-100 group-hover:scale-110">
                        <Plus className="w-6 h-6" />
                    </div>
                    <p className="mt-4 font-bold text-slate-500 group-hover:text-primary transition-colors tracking-tight">Novo Template</p>
                    <p className="text-[10px] text-slate-400 font-medium">Arraste um PDF para começar</p>
                </Card>
            </div>

            {/* Featured AI Section */}
            <Card className="border-border/50 bg-indigo-50 border-none rounded-[3rem] p-12 shadow-sm mt-8 border-l-[12px] border-indigo-600">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 font-bold uppercase tracking-widest text-[10px]">
                            <Sparkles className="w-4 h-4" />
                            Inteligência Gerativa de Texto
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Pareceres Automáticos com IA</h2>
                        <p className="text-slate-600/80 font-medium leading-relaxed max-w-2xl text-lg">
                            Nossa IA analisa as notas e frequência do aluno e gera uma sugestão de parecer pedagógico personalizada, respeitando o tom de voz da sua escola.
                        </p>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl gap-2 shadow-lg shadow-indigo-200 mt-2 transition-all active:scale-95">
                            Conhecer Recurso <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="w-full md:w-1/3 bg-white p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="w-full h-2 bg-indigo-100 rounded-full" />
                        <div className="w-3/4 h-2 bg-indigo-100 rounded-full" />
                        <div className="w-1/2 h-2 bg-indigo-100 rounded-full opacity-50" />
                        <div className="pt-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 animate-pulse" />
                            <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">IA Processando...</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
