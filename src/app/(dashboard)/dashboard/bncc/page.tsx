'use client';

import * as React from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Copy,
  Check,
  ChevronRight,
  SearchX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BNCC_DATA } from '@/lib/bncc-data';
import { toast } from 'sonner';

export default function BNCCExplorerPage() {
  const [search, setSearch] = React.useState('');
  const [segment, setSegment] = React.useState('Todos');
  const [copied, setCopied] = React.useState<string | null>(null);

  const filtered = BNCC_DATA.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesSegment = segment === 'Todos' || item.segment === segment;
    return matchesSearch && matchesSegment;
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Código ${code} copiado!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div>
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
          <BookOpen className="w-4 h-4" />
          Curadoria Pedagógica
        </div>
        <h1 className="text-3xl font-serif font-black italic text-slate-900 tracking-tight">BNCC Explorer</h1>
        <p className="text-sm text-slate-500 mt-1">Pesquise habilidades e competências da Base Nacional Comum Curricular.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar por código (ex: EF09MA01) ou descrição..."
            className="pl-12 h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['Todos', 'Ensino Fundamental I', 'Ensino Fundamental II', 'Ensino Médio'].map((s) => (
            <Button
              key={s}
              variant={segment === s ? 'default' : 'outline'}
              onClick={() => setSegment(s)}
              className="rounded-xl h-14 px-6 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              {s === 'Todos' ? 'Todos' : s.split(' ').pop()}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="rounded-[2.5rem] group hover:border-primary/40 transition-all duration-500 overflow-hidden border-slate-200/60 shadow-lg hover:shadow-xl hover:shadow-primary/5">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="p-8 md:w-48 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between items-start shrink-0">
                <Badge className="bg-primary text-white font-black text-xs tracking-tight px-3 py-1 rounded-lg">
                  {item.code}
                </Badge>
                <div className="mt-4 md:mt-0 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.subject}</p>
                  <p className="font-bold text-slate-900">{item.year}</p>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between items-start gap-6">
                <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                  "{item.description}"
                </p>
                <div className="w-full flex justify-between items-center pt-4 border-t border-slate-50">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none h-7">
                    {item.segment}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.code)}
                    className="gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary rounded-xl px-4"
                  >
                    {copied === item.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied === item.code ? 'Copiado' : 'Copiar Código'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-6 animate-in fade-in zoom-in">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100">
              <SearchX className="w-10 h-10 opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-xl font-serif font-black italic text-slate-900">Nenhuma habilidade encontrada</p>
              <p className="text-sm mt-1">Tente ajustar seus filtros ou termos de pesquisa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
