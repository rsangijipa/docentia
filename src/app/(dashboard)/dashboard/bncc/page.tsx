'use client';

import * as React from 'react';
import {
    Search,
    Filter,
    BookOpen,
    ChevronRight,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    Info,
    Layers,
    GraduationCap,
    Target,
    Compass,
    Sparkles,
    CheckCircle2,
    Clock,
    Library,
    ArrowRight,
    SearchCode,
    Sparkle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function BNCCExplorer() {
    const { bncc } = useMockData();
    const [search, setSearch] = React.useState('');
    const [favorites, setFavorites] = React.useState<string[]>([]);
    const [activeFilter, setActiveFilter] = React.useState('Todos');

    const filteredBNCC = bncc.filter(item => {
        const matchesSearch = item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === 'Todos' || item.subject === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const subjects = ['Todos', 'Matemática', 'Ciências', 'Língua Portuguesa', 'História', 'Geografia', 'Artes'];

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            {/* Header Premium Otimizado */}
            <div className="relative bg-[#022c22] p-10 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] text-white shadow-2xl overflow-hidden border border-emerald-800/50">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 blur-[80px] rounded-full -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">
                            <Library className="w-4 h-4" />
                            Curadoria Educacional
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight leading-[1.1]">BNCC Explorer</h1>
                        <p className="text-emerald-100/70 max-w-xl text-sm sm:text-lg font-medium leading-relaxed">
                            Acesso inteligente à Base Nacional Comum Curricular. Habilidades e competências com curadoria pedagógica.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <Button className="h-14 sm:h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 border-none">
                            <ExternalLink className="w-5 h-5 mr-2" /> Acessar Base MEC
                        </Button>
                        <p className="text-[9px] text-emerald-300/40 text-center font-black tracking-widest uppercase">Versão Consolidada • IA Ready</p>
                    </div>
                </div>
            </div>

            {/* Mobile Filters (Horizontal Scroll) */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 no-scrollbar scroll-hide shadow-[inset_-20px_0_20px_-20px_rgba(0,0,0,0.05)]">
                {subjects.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "whitespace-nowrap px-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 shadow-sm",
                            activeFilter === filter
                                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Desktop Filters Sidebar */}
                <div className="hidden lg:block lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 outline-none">Disciplinas</p>
                        <div className="space-y-1">
                            {subjects.slice(0, 5).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group",
                                        activeFilter === filter
                                            ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100"
                                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-transparent"
                                    )}
                                >
                                    {filter}
                                    <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity", activeFilter === filter && "text-emerald-500 opacity-100")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <Card className="border-border/50 bg-white shadow-2xl shadow-slate-200/50 p-8 rounded-[2rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkle className="w-16 h-16 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] relative z-10">
                            <Sparkles className="w-4 h-4" /> IA Sugestões
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed relative z-10">Cruze habilidades de Matemática com o projeto de Artes atual da sua turma.</p>
                        <Button variant="ghost" className="w-full h-12 px-0 text-[10px] font-black uppercase tracking-widest text-primary flex justify-start gap-2 hover:bg-transparent hover:underline relative z-10">
                            Explorar Conexões <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Card>
                </div>

                {/* Right: Search & Results */}
                <div className="lg:col-span-9 space-y-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                placeholder="Pesquisar por código (EF01MA01) ou tema..."
                                className="pl-14 h-16 bg-white border-slate-200/60 rounded-[1.5rem] shadow-xl shadow-slate-100/50 text-base font-medium transition-all focus:ring-4 focus:ring-emerald-50/50 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-16 px-8 rounded-[1.5rem] border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shrink-0">
                            <Bookmark className="w-5 h-5 text-slate-300" /> Salvos
                            <Badge className="bg-emerald-500 text-white border-none h-6 px-2 font-black text-[10px] ml-1">{favorites.length}</Badge>
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {filteredBNCC.length > 0 ? (
                            filteredBNCC.map((item) => (
                                <Card key={item.id} className="group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row min-h-[220px]">
                                            <div className="lg:w-64 p-8 bg-slate-50 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 shrink-0">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">{item.subject}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-serif font-black text-slate-800 tracking-tight leading-none italic">{item.code}</h3>
                                                </div>
                                                <div className="pt-6">
                                                    <Badge variant="outline" className="rounded-lg h-7 bg-white border-slate-200 text-slate-500 font-black text-[9px] uppercase tracking-widest px-3">{item.grade}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between relative">
                                                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-slate-50">
                                                        <Info className="w-5 h-5 text-slate-300" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-6">
                                                    <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed pr-6">
                                                        {item.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black text-[9px] uppercase px-3 h-6 shadow-none flex items-center gap-1.5">
                                                            <Target className="w-3 h-3" /> Habilidade
                                                        </Badge>
                                                        <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-black text-[9px] uppercase px-3 h-6 shadow-none flex items-center gap-1.5">
                                                            <Compass className="w-3 h-3" /> Cognitivo
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-50 mt-8 gap-4">
                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "flex-1 sm:flex-none h-12 gap-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                favorites.includes(item.id) ? "text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm" : "text-slate-400 hover:text-slate-600 border border-transparent"
                                                            )}
                                                            onClick={() => toggleFavorite(item.id)}
                                                        >
                                                            {favorites.includes(item.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                                            {favorites.includes(item.id) ? 'Item Salvo' : 'Marcar Referência'}
                                                        </Button>
                                                    </div>
                                                    <Button className="w-full sm:w-auto bg-slate-900 border-none hover:bg-emerald-600 text-white font-black h-12 rounded-2xl px-10 text-[10px] uppercase tracking-widest gap-3 transition-all shadow-xl shadow-slate-100">
                                                        Vincular a Plano <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-20 sm:p-32 text-center border-dashed border-2 flex flex-col items-center gap-8 rounded-[2.5rem] bg-white border-slate-200/60">
                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                                    <Compass className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif font-black text-slate-800 tracking-tight">Canteiro Deserto</h3>
                                    <p className="text-slate-500 font-medium max-w-sm">Tente ajustar seus termos de busca ou mude a disciplina ativa.</p>
                                </div>
                                <Button onClick={() => { setSearch(''); setActiveFilter('Todos'); }} className="h-14 rounded-2xl px-12 font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white border-none shadow-xl shadow-slate-200">Limpar Parâmetros</Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
