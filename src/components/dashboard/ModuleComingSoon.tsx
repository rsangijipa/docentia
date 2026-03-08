'use client';

import { LucideIcon, Sparkles, Clock3, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  eta?: string;
  backTo?: string;
};

export function ModuleComingSoon({
  title,
  subtitle,
  description,
  icon: Icon,
  eta = 'Próximas sprints',
  backTo = '/dashboard',
}: Props) {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div>
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
          <Icon className="w-4 h-4" />
          {subtitle}
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-black italic tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <Card className="rounded-[2.5rem] border-slate-200/60 bg-white shadow-xl overflow-hidden">
        <CardHeader className="p-10 sm:p-12 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl sm:text-3xl font-serif font-black italic text-slate-900">
              Módulo em evolução
            </CardTitle>
            <Badge className="h-7 px-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-black text-[10px] uppercase tracking-widest">
              Em breve
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-10 sm:p-12 space-y-8">
          <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
            <Sparkles className="w-10 h-10" />
          </div>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Clock3 className="w-4 h-4" />
                Previsão
              </div>
              <p className="mt-2 text-slate-800 font-bold">{eta}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Status do piloto
              </div>
              <p className="mt-2 text-emerald-900 font-bold">Sem cenografia ativa nesta tela</p>
            </div>
          </div>

          <div className="pt-2">
            <Link href={backTo}>
              <Button className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest">
                Voltar ao painel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
