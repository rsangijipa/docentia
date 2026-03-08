'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Calendar as CalendarIcon,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Target,
  Bell,
  MoreVertical,
  Zap,
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  ShieldAlert,
  Flame,
  LayoutGrid,
  Activity,
  Award,
  BookMarked,
  Share2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardServiceFB, LessonPlanServiceFB } from '@/services/firebase/domain-services';
import { cn } from '@/lib/utils';

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        const [statsData, agendaData] = await Promise.all([
          DashboardServiceFB.getStats(user.id),
          LessonPlanServiceFB.getDailyAgenda(user.id)
        ]);

        setData({
          ...statsData,
          agenda: agendaData
        });
      } catch (err) {
        console.error('Error fetching dashboard stats from Firebase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const firstName = user?.name?.split(' ')[0] ?? 'Professor';

  const stats = [
    {
      title: 'Turmas Ativas',
      value: data?.stats?.turmasCount?.toString() ?? '0',
      sub: 'Ecossistema 2026',
      icon: Users,
      accent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      barColor: 'bg-indigo-500',
      progress: 100,
    },
    {
      title: 'Habilidades BNCC',
      value: '24', // TODO: Implement real BNCC link
      sub: 'Meta do Bimestre: 30',
      icon: Target,
      accent: 'bg-violet-50 text-violet-700 border-violet-100',
      barColor: 'bg-violet-400',
      progress: 80,
    },
    {
      title: 'Eficiência de Aula',
      value: '94%', // TODO: Calculate based on diary entries
      sub: 'Baseado no Diário',
      icon: Activity,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      barColor: 'bg-emerald-400',
      progress: 94,
    },
    {
      title: 'Pendências IA',
      value: data?.stats?.pendingDiariesCount?.toString() ?? '0',
      sub: 'Pendências detectadas',
      icon: Zap,
      accent: 'bg-rose-50 text-rose-700 border-rose-100',
      barColor: 'bg-rose-400',
      progress: 100,
      alert: (data?.stats?.pendingDiariesCount ?? 0) > 0,
    },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando seu posto de comando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      {/* Header Premium Maestro - Centro de Comando */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <ShieldAlert className="w-4 h-4 text-primary animate-pulse" />
            Painel de Controle Pedagógico
          </div>
          <h1 className="text-4xl lg:text-6xl font-serif font-black text-slate-900 tracking-tighter leading-none italic">
            Maestro {firstName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm lg:text-base">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200/50">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span className="font-bold">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 italic">
              <Activity className="w-3.5 h-3.5" /> Sistema Operacional
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Link href="/dashboard/planos-aula" className="flex-1 lg:flex-none">
            <Button className="w-full h-16 px-10 rounded-[1.5rem] bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl shadow-slate-200 border-none hover:bg-primary transition-all group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Criar Plano
            </Button>
          </Link>
          <Link href="/dashboard/diario" className="flex-1 lg:flex-none">
            <Button variant="outline" className="w-full h-16 px-10 rounded-[1.5rem] border-slate-200 bg-white text-slate-600 font-black text-[10px] uppercase tracking-widest gap-3 hover:bg-slate-50 transition-all">
              <ClipboardCheck className="w-5 h-5 text-slate-300" /> Diário de Classe
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Premium */}
      <div className="flex overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-8 scrollbar-hide lg:overflow-visible no-scrollbar">
        {stats.map((stat, i) => (
          <Card key={i} className="min-w-[300px] lg:min-w-0 group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border-slate-200/60 overflow-hidden bg-white rounded-[2.5rem] shadow-sm relative border-t-0">
            <div className={cn("absolute top-0 left-0 right-0 h-1.5", stat.barColor)} />
            <CardContent className="p-8 lg:p-10 relative">
              <div className="flex justify-between items-start mb-8">
                <div className={cn("p-4 rounded-[1.25rem] border transition-all group-hover:rotate-6 group-hover:scale-110 duration-500 shadow-inner", stat.accent)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.alert && (
                  <Badge variant="outline" className="border-rose-100 bg-rose-50 text-rose-600 font-black text-[9px] uppercase px-3 py-1 rounded-full animate-pulse tracking-widest leading-none">
                    <Flame className="w-3 h-3 mr-1" /> Crítico
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-serif font-black text-slate-900 group-hover:text-primary transition-colors italic leading-none tracking-tighter">{stat.value}</h3>
                </div>
                <p className="text-[11px] text-slate-400 font-bold tracking-tight italic">{stat.sub}</p>
              </div>
              <div className="mt-8">
                <Progress value={stat.progress} className="h-1.5 bg-slate-50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Lado Esquerdo - Operação Realtime (Agenda e Inteligência) */}
        <div className="lg:col-span-8 space-y-12">

          {/* Agenda Crítica - O Coração do Dashboard */}
          <Card className="border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white rounded-[3rem]">
            <CardHeader className="p-10 sm:p-12 pb-8 flex flex-row items-center justify-between border-b border-slate-50 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
              <div className="space-y-1">
                <CardTitle className="text-3xl font-serif font-black text-slate-900 italic tracking-tight">Posto de Comando Hoje</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest h-6 px-3">Sala de Situação</Badge>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">
                    {(data?.agenda?.length || 0)} Aulas Confirmadas
                  </span>
                </div>
              </div>
              <Button variant="ghost" className="hidden sm:flex h-12 px-6 text-[10px] font-black uppercase text-slate-400 hover:text-primary tracking-widest gap-2 bg-slate-50 rounded-2xl group/btn">
                Mapeamento Semanal <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative p-10 sm:p-12 pt-10">
                <div className="absolute left-[78px] sm:left-[94px] top-12 bottom-12 w-px bg-slate-100 hidden sm:block" />

                <div className="space-y-12">
                  {(data?.agenda || []).length > 0 ? (
                    (data?.agenda || []).map((item: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-6 sm:gap-12 group relative">
                        <div className="w-20 text-left sm:text-right shrink-0">
                          <p className="text-lg font-serif font-black text-slate-900 tabular-nums italic">
                            {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{i === 0 ? 'Agora' : 'Próxima'}</p>
                        </div>

                        <div className="hidden sm:block">
                          <div className={cn(
                            "w-5 h-5 rounded-full mt-1.5 z-10 ring-8 transition-all duration-700",
                            i === 0
                              ? 'bg-slate-900 ring-slate-100 shadow-[0_0_30px_rgba(15,23,42,0.4)] scale-125'
                              : 'bg-white border-4 border-slate-100 ring-white group-hover:border-primary group-hover:scale-110 shadow-sm'
                          )} />
                        </div>

                        <div className={cn(
                          "flex-1 p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group/card shadow-sm hover:shadow-xl",
                          i === 0
                            ? "bg-[#0f172a] text-white border-slate-800"
                            : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200"
                        )}>
                          {i === 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />}

                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="space-y-1">
                              <h4 className="font-serif font-black text-xl lg:text-2xl italic tracking-tight leading-tight group-hover/card:text-primary transition-colors">
                                {item.nomeTurma || item.coursePlan?.room?.nome || 'Turma'} — {item.topic}
                              </h4>
                              <p className={cn("text-xs font-medium italic opacity-60", i === 0 ? "text-slate-200" : "text-slate-500")}>
                                {item.content || 'Consulte o plano de aula no módulo de planejamento.'}
                              </p>
                            </div>
                            {i === 0 && (
                              <Badge className="bg-primary text-white border-none text-[8px] font-black px-4 h-6 uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 animate-pulse">
                                Em Execução
                              </Badge>
                            )}
                          </div>

                          {i === 0 && (
                            <div className="pt-8 flex flex-wrap gap-4 border-t border-white/5 mt-6">
                              <Button className="bg-white text-slate-900 hover:bg-white/90 font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-2xl shadow-xl shadow-black/40 border-none transition-all active:scale-95">Abrir Chamada de Presença</Button>
                              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-2xl border-none">Roteiro da Aula</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-medium italic">Nenhuma atividade agendada para hoje.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Central de Pendências e Inteligência IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Pendências Críticas / Diários Atrasados */}
            <Card className="border-slate-200/60 bg-white rounded-[3rem] overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-rose-100 transition-all">
              <CardHeader className="p-10 border-b border-slate-50 flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-[9px] mb-1">
                    <AlertCircle className="w-4 h-4" /> Pendências Críticas
                  </div>
                  <CardTitle className="text-2xl font-serif font-black text-slate-900 italic leading-none">Ação Imediata</CardTitle>
                </div>
                <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 flex items-center justify-center text-rose-600 font-black text-xl italic shadow-inner group-hover:scale-110 transition-transform">
                  {data?.stats?.pendingDiariesCount || 0}
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                {(data?.stats?.pendingDiariesCount || 0) > 0 ? (
                  <div className="flex gap-5 items-start p-5 rounded-[1.5rem] hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 cursor-pointer group/item">
                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm bg-rose-500 animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DIÁRIO</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight group-item-hover:text-rose-600 transition-colors">Você possui diários pendentes de preenchimento.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-center text-slate-400 py-4 italic">Nenhuma pendência crítica detectada.</p>
                )}
                <Button className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-200 border-none mt-4 transition-all">
                  Auditagem Automática IA <Zap className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Performance Global por Turma */}
            <Card className="border-slate-200/60 bg-white rounded-[3rem] overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-indigo-100 transition-all">
              <CardHeader className="p-10 border-b border-slate-50 flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-widest text-[9px] mb-1">
                    <Award className="w-4 h-4" /> Monitor de Progresso
                  </div>
                  <CardTitle className="text-2xl font-serif font-black text-slate-900 italic leading-none">Métricas de Turma</CardTitle>
                </div>
                <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-primary group-hover:text-white transition-all shadow-inner italic font-black text-xl">
                  {data?.stats?.turmasCount || 0}
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400 italic">Analítico de turmas disponível em breve.</p>
                </div>
                <Button variant="ghost" className="w-full h-14 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl mt-4">Analytic Completo de Turmas</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lado Direito - Apoio Estratégico (Radar IA e Fluxos) */}
        <div className="lg:col-span-4 space-y-10">

          {/* Radar de Notificações da Rede - Dark Premium */}
          <Card className="border-none bg-[#0f172a] text-white rounded-[3rem] shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            <CardHeader className="p-10 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fluxo da Rede</p>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <CardTitle className="text-2xl font-serif font-black italic mt-2">Central de Radar</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-6">
              {(data?.stats?.notifications || []).length > 0 ? (
                (data?.stats?.notifications || []).map((notif: any) => (
                  <div key={notif.id} className="group/notif p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-xs font-black tracking-tight leading-tight group-notif-hover:text-primary transition-colors">{notif.title}</p>
                      {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2 italic">"{notif.message}"</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-center text-slate-500 py-10 italic">Nenhum alerta recente.</p>
              )}
              <Button className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black text-[10px] uppercase tracking-widest mt-6 border-none shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">Expandir Central <Share2 className="w-4 h-4 ml-2" /></Button>
            </CardContent>
          </Card>

          {/* Curadoria PNLD - Status do Livro Didático */}
          <Card className="border-slate-200/60 rounded-[3rem] bg-white shadow-xl shadow-slate-200/20 overflow-hidden group">
            <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativos Bibliográficos</p>
                <CardTitle className="text-2xl font-serif font-black text-slate-900 leading-none italic">Uso PNLD 2026</CardTitle>
              </div>
              <div className="w-16 h-16 rounded-[1.75rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shadow-inner">
                <BookMarked className="w-8 h-8" />
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-10">
              <div className="flex justify-between items-center bg-[#f8fafc] p-8 rounded-[2.5rem] border border-slate-100 shadow-inner group/stat">
                <div className="space-y-2">
                  <h5 className="text-5xl font-serif font-black text-slate-900 italic tracking-tighter group-hover/stat:text-primary transition-colors">0%</h5>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cobertura Atual</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                    <circle className="text-slate-100 stroke-current" strokeWidth="10" fill="transparent" r="42" cx="50" cy="50" />
                    <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="263.8" strokeDashoffset={`${263.8}`} strokeLinecap="round" fill="transparent" r="42" cx="50" cy="50" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary opacity-20" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs text-center text-slate-400 italic py-4">Vincule seus livros didáticos para acompanhar o progresso.</p>
              </div>
            </CardContent>
          </Card>

          {/* Caixa de Ferramentas Rápidas - Arquivos Legislativos */}
          <Card className="border-slate-200/60 rounded-[3rem] bg-white shadow-sm overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
                Exportação de Auditoria <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-2 space-y-5">
              <div className="text-center py-6 text-slate-400 italic text-sm">Nenhum arquivo recente gerado.</div>
              <Button variant="ghost" className="w-full h-14 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl mt-4">Biblioteca de Documentos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
