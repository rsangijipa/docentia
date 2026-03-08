'use client';

import * as React from 'react';
import {
  Plus,
  BookOpen,
  Search,
  Layers,
  Pencil,
  ExternalLink,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  Clock,
  MoreVertical,
  Library,
  Bookmark,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function LivroDidaticoPage() {
  const { textbooks } = useMockData();
  const [search, setSearch] = React.useState('');
  const [activeArea, setActiveArea] = React.useState('Todas');

  const areas = ['Todas', 'Matemática', 'Ciências', 'História', 'Geografia', 'Português'];

  const filtered = textbooks.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchArea = activeArea === 'Todas' || l.subject === activeArea;
    return matchSearch && matchArea;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-orange-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full -ml-16 -mb-16" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Library className="w-4 h-4" />
            Gestão de Patrimônio Didático
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tight">Livro Didático</h1>
          <p className="text-orange-200/60 max-w-xl text-lg font-medium leading-relaxed">
            Monitore o avanço programático das suas coleções e garanta que o conteúdo planejado esteja em sincronia com o material físico.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold gap-2">
            <Bookmark className="w-5 h-5" /> Minha Biblioteca
          </Button>
          <Button className="h-14 px-8 rounded-2xl bg-orange-500 text-orange-950 hover:bg-orange-400 font-bold gap-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-md font-black">
            <Plus className="w-5 h-5" /> Registrar Livro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Áreas de Conhecimento</p>
            <div className="space-y-1">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all",
                    activeArea === area
                      ? "bg-orange-100 text-orange-700 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {area}
                  <ChevronRight className={cn("w-3 h-3 opacity-40", activeArea === area && "text-orange-500 opacity-100")} />
                </button>
              ))}
            </div>
          </div>

          <Card className="border-border/50 bg-white shadow-sm p-6 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Insights de Avanço
            </div>
            <p className="text-[10px] text-muted-foreground font-medium italic">O avanço médio das suas coleções está 12% acima da meta para este bimestre.</p>
            <Button variant="ghost" className="w-full h-8 px-0 text-[10px] font-bold text-orange-600 flex justify-start gap-1 hover:bg-transparent hover:underline">
              Relatório de Eficiência <ChevronRight className="w-3 h-3" />
            </Button>
          </Card>
        </div>

        {/* Right: Search & Cards */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por título ou editora..."
                className="pl-12 h-14 bg-white border-border/60 rounded-[1.25rem] shadow-sm text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-[1.25rem] border-border/60 bg-white font-bold gap-2">
              <FilterSimple className="w-4 h-4" /> Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(book => (
              <Card key={book.id} className="group hover:shadow-2xl transition-all duration-500 border-border/40 bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                <div className="p-8 pb-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[8px] uppercase px-2 h-4">{book.subject}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors pr-8">{book.title}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{book.publisher} · {book.grade}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-primary transition-all rounded-xl -mr-4 -mt-2">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                <CardContent className="p-8 pt-0 flex-1 space-y-8">
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avanço Programático</p>
                        <p className="text-3xl font-serif font-black text-slate-800">{book.progress}%</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-[10px] font-bold">+2%</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">{book.currentChapter} de {book.totalChapters} caps</p>
                      </div>
                    </div>
                    <Progress value={book.progress} className="h-2 bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Última Unidade</span>
                      <span className="text-sm font-bold text-slate-800 block truncate">Cap. {book.currentChapter}: {book.statusByChapter.find(c => c.status === 'completed')?.title || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Próxima Aula</span>
                      <span className="text-sm font-bold text-orange-600 block truncate flex items-center gap-1.5"> <Zap className="w-3 h-3 fill-current" /> Vincular Cap</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2 group-hover:bg-primary/5 transition-colors">
                  <Button variant="ghost" className="h-11 rounded-xl text-xs font-bold text-muted-foreground gap-2 border border-slate-200 bg-white">
                    <Layers className="w-4 h-4" /> Detalhes
                  </Button>
                  <Button className="h-11 rounded-xl text-xs font-bold bg-slate-900 border-none gap-2 hover:bg-orange-600 transition-colors">
                    Planejar Aula <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* Add Book Placeholder */}
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50/20 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-white hover:border-orange-300 transition-all cursor-pointer group">
              <div className="w-16 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-200 group-hover:text-orange-500 transition-all border border-slate-100 group-hover:scale-110">
                <Plus className="w-8 h-8" />
              </div>
              <p className="mt-4 font-bold text-slate-500 group-hover:text-orange-600 transition-colors tracking-tight">Nova Obra</p>
              <p className="text-[10px] text-slate-400 font-medium">Adoção PNLD 2026</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSimple(props: any) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
