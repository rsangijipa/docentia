'use client';

import * as React from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  Users,
  BookOpen,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  ArrowLeft,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  DiaryEntryServiceFB,
  EvaluationServiceFB,
  LessonPlanServiceFB,
  StudentServiceFB,
  ClassroomServiceFB
} from '@/services/firebase/domain-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ReportsPage() {
  const { user } = useAuth();

  const { data: diaryEntries = [] } = useQuery({
    queryKey: ['diary-entries', user?.id],
    queryFn: () => user?.id ? DiaryEntryServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: evaluations = [] } = useQuery({
    queryKey: ['evaluations', user?.id],
    queryFn: () => user?.id ? EvaluationServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: lessonPlans = [] } = useQuery({
    queryKey: ['lesson-plans', user?.id],
    queryFn: () => user?.id ? LessonPlanServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students', user?.id],
    queryFn: () => user?.id ? StudentServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const stats = [
    { label: 'Eficiência de Planejamento', value: '94%', trend: '+2.4%', up: true, icon: Target, color: 'indigo' },
    { label: 'Engajamento de Alunos', value: '88%', trend: '+5.1%', up: true, icon: Users, color: 'emerald' },
    { label: 'Cobertura BNCC', value: '72%', trend: '-1.2%', up: false, icon: BookOpen, color: 'amber' },
    { label: 'Aproveitamento Acadêmico', value: '8.4', trend: '+0.3', up: true, icon: TrendingUp, color: 'violet' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header com Navegação */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div className='flex items-center gap-6'>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-serif font-black italic text-slate-900 tracking-tight">Relatórios Analíticos</h1>
            <p className='text-zinc-500 font-medium italic text-sm'>Visão estratégica do seu impacto pedagógico.</p>
          </div>
        </div>
        <div className='flex gap-3'>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 bg-white font-bold gap-2">
            <Filter className="w-4 h-4" /> Filtrar Período
          </Button>
          <Button className="h-12 px-6 rounded-xl bg-violet-950 text-white font-bold gap-2 shadow-xl shadow-black/10">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] border-none bg-white p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10", `bg-${stat.color}-500`)} />
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-2xl", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge className={cn(
                  "bg-transparent border-none font-black text-[10px] tracking-tight flex items-center gap-1",
                  stat.up ? "text-emerald-500" : "text-rose-500"
                )}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-4xl font-serif font-black italic text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Visualizations */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="rounded-[3.5rem] border-none bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div className='space-y-1'>
                <CardTitle className="text-2xl font-serif font-black italic">Atividade Semanal</CardTitle>
                <p className='text-sm font-medium text-slate-400 italic'>Consolidado de Diários, Planos e Avaliações</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="w-5 h-5 text-slate-400" /></Button>
            </CardHeader>
            <CardContent className="p-10">
              <div className="h-64 flex items-end justify-between gap-4 pt-4">
                {[65, 42, 88, 55, 95, 70, 30].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div
                      className="w-full bg-slate-50 rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-lg"
                      style={{ height: `${val}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-600 to-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] border-none bg-white shadow-xl shadow-slate-200/40 p-10 space-y-6">
              <div className='flex items-center justify-between'>
                <h4 className="text-lg font-serif font-black italic">Composição de Carga</h4>
                <BarChart3 className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Teoria e Leituras', val: 40, color: 'bg-indigo-500' },
                  { label: 'Atividades Práticas', val: 35, color: 'bg-emerald-500' },
                  { label: 'Avaliações', val: 15, color: 'bg-amber-500' },
                  { label: 'Projetos', val: 10, color: 'bg-rose-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <Progress value={item.val} className={cn("h-2.5", item.color)} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[3rem] border-none bg-zinc-950 text-white shadow-2xl p-10 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className='space-y-4 relative z-10'>
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                  <Sparkles className="w-4 h-4" /> Intelligence Layer
                </div>
                <h4 className="text-2xl font-serif font-black italic leading-tight">Insight Preditivo</h4>
                <p className="text-zinc-400 text-sm font-medium italic leading-relaxed">
                  &quot;Com base no histórico das últimas 4 semanas, sugerimos aumentar o tempo de atividades práticas no projeto de sustentabilidade para manter o engajamento.&quot;
                </p>
              </div>
              <Button className="mt-8 bg-white text-zinc-950 hover:bg-white/90 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-xl relative z-10">
                Ajustar Planejamento
              </Button>
            </Card>
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="rounded-[3.5rem] border-none bg-white shadow-xl shadow-slate-200/50 p-10 space-y-8">
            <div className='space-y-1'>
              <h4 className="text-xl font-serif font-black italic">Ranking de Disciplinas</h4>
              <p className='text-xs font-medium text-slate-400 italic'>Aproveitamento por área de conhecimento</p>
            </div>
            <div className="space-y-8">
              {[
                { label: 'Português', score: '9.2', students: 42, color: 'indigo' },
                { label: 'Literatura', score: '8.8', students: 38, color: 'emerald' },
                { label: 'Redação', score: '8.4', students: 45, color: 'amber' },
                { label: 'Artes', score: '7.6', students: 32, color: 'rose' }
              ].map((disc, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className={cn("h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center text-xl font-serif italic font-black shadow-inner", `bg-${disc.color}-50 text-${disc.color}-600`)}>
                    {disc.score}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">{disc.label}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{disc.students} Alunos Inscritos</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary gap-2 h-12">
              Ver todas as turmas <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="rounded-[3.5rem] border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 shadow-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div className="p-4 rounded-2xl bg-white/10 w-fit backdrop-blur-xl">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className='space-y-2'>
                <h4 className="text-2xl font-serif font-black italic">Métrica de Impacto</h4>
                <p className="text-white/60 font-medium italic text-lg leading-relaxed">
                  Você já gerou mais de 240 horas de planos de aula otimizados este ano.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
