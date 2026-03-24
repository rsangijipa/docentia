'use client';

import * as React from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ArrowLeft,
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notificationService } from '@/services/supabase/domain-services';

export default function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user?.id ? notificationService.getByUser(user.id) : [],
    enabled: !!user?.id
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => user?.id ? notificationService.markAllAsRead(user.id) : Promise.reject(),
    onSuccess: () => {
      toast.success('Todas as notificações marcadas como lidas.');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      toast.success('Notificação removida.');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  if (isLoading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-zinc-500 font-medium italic'>Carregando suas notificações...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-24">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 gap-10 transition-all hover:border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="space-y-4 text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.25em] text-[10px]">
            <Bell className="w-4 h-4" />
            Central de Alertas
          </div>
          <h1 className="text-5xl lg:text-6xl font-serif font-black italic tracking-tight text-slate-900 leading-tight">Notificações</h1>
          <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed italic">
            Mantenha-se informado sobre prazos, atividades de alunos e atualizações do sistema Docentia.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-5 min-w-[200px] relative z-10">
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              variant="ghost"
              className="text-[10px] font-black uppercase tracking-widest text-primary gap-2 hover:bg-primary/5 rounded-xl h-12 px-6"
            >
              <CheckCheck className="w-4 h-4" /> Marcar todas como lidas
            </Button>
          )}
          <Badge className="h-14 w-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-xl font-serif italic shadow-2xl">
            {unreadCount}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {notifications.length > 0 ? notifications.map((notif: any) => (
          <Card
            key={notif.id}
            onClick={() => !notif.is_read && markReadMutation.mutate(notif.id)}
            className={cn(
              "group hover:shadow-2xl transition-all duration-700 border-slate-100 bg-white rounded-[2.5rem] overflow-hidden cursor-pointer relative",
              !notif.is_read ? "border-l-4 border-l-primary shadow-lg shadow-primary/5" : "opacity-70 grayscale-[0.5]"
            )}
          >
            <CardContent className="p-8 flex items-center gap-8">
              <div className={cn(
                "h-14 w-14 shrink-0 rounded-[1.25rem] border-2 flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-inner",
                notif.type === 'alert' ? "bg-rose-50 border-rose-100 text-rose-500" :
                  notif.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                    "bg-indigo-50 border-indigo-100 text-indigo-500"
              )}>
                {notif.type === 'alert' ? <AlertCircle className="w-6 h-6" /> :
                  notif.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                    <Info className="w-6 h-6" />}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 border-slate-100 px-2 py-0.5">
                    {notif.category || 'Sistema'}
                  </Badge>
                  {!notif.is_read && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
                <h4 className={cn(
                  "text-xl font-bold text-slate-900 transition-all group-hover:text-primary",
                  !notif.is_read && "font-black"
                )}>{notif.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{notif.message}</p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(notif.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <Button
                  variant="ghost"
                  className="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(notif.id);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="py-32 text-center space-y-6 bg-white rounded-[4rem] border border-dashed border-slate-200">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 group-hover:scale-110 transition-transform">
              <Bell className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-black italic text-slate-900">Silêncio de Ouro</h3>
              <p className="text-slate-400 font-medium italic">Você está em dia com todas as comunicações.</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Banner */}
      <Card className="bg-slate-950 border-none text-white rounded-[3.5rem] p-12 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Filtro Inteligente Ativado</h4>
            <h3 className="text-3xl font-serif font-black italic text-white tracking-tight">Otimização de Ruído</h3>
            <p className="text-slate-400 font-medium leading-relaxed italic text-lg">
              &quot;O Docentia AI priorizou os alertas críticos para que você foque no ensino, não apenas na logística.&quot;
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
