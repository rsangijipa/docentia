'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ClipboardList,
  Loader2,
  RefreshCw,
  Users,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardServiceFB, LessonPlanServiceFB } from '@/services/firebase/domain-services';

type DashboardPayload = {
  stats: {
    turmasCount: number;
    studentsCount: number;
    plansCount: number;
    pendingDiariesCount: number;
    notifications: Array<{ id: string; title?: string; message?: string; read?: boolean }>;
  };
  agenda: Array<{
    id: string;
    topic?: string;
    content?: string;
    date?: { seconds?: number; toDate?: () => Date } | string | Date;
    nomeTurma?: string;
  }>;
};

function formatAgendaTime(value: DashboardPayload['agenda'][number]['date']) {
  if (!value) return '--:--';

  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  if (typeof value === 'object' && typeof value.seconds === 'number') {
    const date = new Date(value.seconds * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return '--:--';
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = React.useState<DashboardPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [statsData, agendaData] = await Promise.all([
        DashboardServiceFB.getStats(user.id),
        LessonPlanServiceFB.getDailyAgenda(user.id),
      ]);

      setData({
        ...statsData,
        agenda: agendaData,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Nao foi possivel carregar o painel agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const firstName = user?.name?.split(' ')[0] ?? 'Professor';

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Carregando seu painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-xl mx-auto mt-8 border-rose-200 bg-rose-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="h-5 w-5" />
            Erro no carregamento
          </CardTitle>
          <CardDescription className="text-rose-700/80">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => void fetchData()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stats = data?.stats;
  const agenda = data?.agenda ?? [];

  return (
    <div className="space-y-6 pb-8">
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ola, {firstName}</h1>
          <p className="text-slate-600 mt-1">Resumo operacional do dia com dados reais da sua conta.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/planos-aula">
            <Button>Criar plano</Button>
          </Link>
          <Link href="/dashboard/diario">
            <Button variant="outline">Abrir diario</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2"><Users className="h-4 w-4" /> Turmas ativas</CardDescription>
            <CardTitle>{stats?.turmasCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2"><Users className="h-4 w-4" /> Alunos ativos</CardDescription>
            <CardTitle>{stats?.studentsCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Planos de aula</CardDescription>
            <CardTitle>{stats?.plansCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Diarios pendentes</CardDescription>
            <CardTitle>{stats?.pendingDiariesCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Agenda de hoje</CardTitle>
            <CardDescription>Aulas planejadas para o dia atual.</CardDescription>
          </CardHeader>
          <CardContent>
            {agenda.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
                Nenhuma aula agendada para hoje.
              </div>
            ) : (
              <div className="space-y-3">
                {agenda.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.nomeTurma || 'Turma'} - {item.topic || 'Sem topico'}</p>
                      <p className="text-sm text-slate-600 mt-1">{item.content || 'Sem descricao cadastrada.'}</p>
                    </div>
                    <Badge variant="secondary">{formatAgendaTime(item.date)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificacoes</CardTitle>
            <CardDescription>Alertas nao lidos do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(stats?.notifications ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma notificacao pendente.</p>
            ) : (
              (stats?.notifications ?? []).slice(0, 5).map((notif: any) => (
                <div key={notif.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium text-slate-900">{notif.title || 'Notificacao'}</p>
                  <p className="text-xs text-slate-600 mt-1">{notif.message || 'Sem detalhes.'}</p>
                </div>
              ))
            )}

            <Link href="/dashboard/notificacoes">
              <Button variant="outline" className="w-full">Ver todas</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
