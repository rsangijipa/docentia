'use client';

import * as React from 'react';
import {
    Bell,
    Search,
    MoreVertical,
    CheckCircle2,
    Trash2,
    Inbox,
    Clock,
    Zap,
    AlertCircle,
    FileText,
    BadgeCheck,
    ChevronRight,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function NotificacoesPage() {
    const { notifications } = useMockData();
    const [activeTab, setActiveTab] = React.useState('todas');

    const filtered = notifications.filter(n => {
        if (activeTab === 'todas') return true;
        if (activeTab === 'nao-lidas') return !n.read;
        return false;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Compacto */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/50 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Bell className="w-5 h-5 animate-bounce-subtle" />
                        <span className="text-[10px] tracking-[0.2em] uppercase">Central de Avisos</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
                        Notificações
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Fique por dentro de prazos, pendências e insights da IA.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-xs font-bold text-muted-foreground hover:text-primary gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Marcar todas como lidas
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Notifs Content */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex p-1 bg-muted/40 rounded-2xl w-fit border border-border/50 mb-2">
                        {['todas', 'nao-lidas', 'importantes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-bold transition-all capitalize",
                                    activeTab === tab ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filtered.map((notif) => (
                            <Card key={notif.id} className={cn(
                                "group hover:shadow-lg transition-all border-border/40 bg-white rounded-2xl overflow-hidden cursor-pointer",
                                !notif.read && "border-l-4 border-l-primary"
                            )}>
                                <CardContent className="p-5 flex gap-5">
                                    <div className={cn(
                                        "p-3 rounded-xl shrink-0 transition-colors",
                                        notif.type === 'pendency' ? "bg-rose-50 text-rose-500" :
                                            notif.type === 'inconsistency' ? "bg-amber-50 text-amber-600" :
                                                notif.type === 'suggestion' ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {notif.type === 'pendency' ? <Clock className="w-5 h-5" /> :
                                            notif.type === 'inconsistency' ? <AlertCircle className="w-5 h-5" /> :
                                                notif.type === 'suggestion' ? <Zap className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={cn("font-bold text-sm", !notif.read ? "text-slate-900" : "text-slate-500")}>{notif.title}</h4>
                                            <span className="text-[10px] text-muted-foreground font-medium">Há 2 horas</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                                        {notif.link && (
                                            <Button variant="link" className="p-0 h-auto text-[10px] text-primary font-bold gap-1 mt-2">
                                                Ver detalhes <ChevronRight className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                                <Inbox className="w-8 h-8" />
                            </div>
                            <p className="text-muted-foreground font-medium">Nenhuma notificação por aqui.</p>
                        </div>
                    )}
                </div>

                {/* Filters Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-[2.5rem] bg-indigo-950 border-none text-white p-8 space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                                <BadgeCheck className="w-4 h-4" /> Resumo do Sistema
                            </div>
                            <h3 className="text-2xl font-serif font-bold">Saúde da Conta</h3>
                            <p className="text-indigo-200/60 text-xs leading-relaxed">Não há bloqueios regulamentares ativos. Todos os diários desta semana foram processados.</p>
                        </div>
                        <div className="pt-4 relative z-10">
                            <Button className="w-full h-11 bg-white text-indigo-950 hover:bg-indigo-400 hover:text-white font-bold rounded-xl border-none transition-all">Relatório de Atividade</Button>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border/50 bg-white p-8 space-y-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Configurar Avisos</p>
                        <div className="space-y-4 pt-2">
                            {[
                                { label: 'E-mail Diário', value: true },
                                { label: 'Push no Navegador', value: false },
                                { label: 'Alertas Grade Crítica', value: true },
                            ].map((opt, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                                    <div className={cn(
                                        "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                                        opt.value ? "bg-primary" : "bg-slate-200"
                                    )}>
                                        <div className={cn(
                                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                            opt.value ? "right-1" : "left-1"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
