'use client';

import * as React from 'react';
import {
    User,
    Settings,
    Bell,
    Shield,
    CreditCard,
    LogOut,
    Camera,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    Globe,
    Moon,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function PerfilPage() {
    const { professor } = useMockData();
    const [activeTab, setActiveTab] = React.useState('perfil');

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-violet-950 to-indigo-950 rounded-[3.5rem]" />
                <div className="absolute -bottom-12 left-12 flex items-end gap-6 text-white">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl relative overflow-hidden">
                            <div className="w-full h-full rounded-[2.25rem] bg-slate-100 flex items-center justify-center text-slate-300">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                        <button className="absolute bottom-1 right-1 h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-all">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="pb-4 space-y-1">
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-white mb-2">{professor.nome}</h1>
                        <div className="flex gap-2">
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-md px-3">Professor Titular</Badge>
                            <Badge variant="outline" className="text-white/60 border-white/20">ID: {professor.id}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'perfil', label: 'Meu Perfil', icon: User },
                        { id: 'config', label: 'Configurações', icon: Settings },
                        { id: 'notif', label: 'Notificações', icon: Bell },
                        { id: 'seguranca', label: 'Segurança', icon: Shield },
                        { id: 'assinatura', label: 'Assinatura', icon: CreditCard },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-xl shadow-black/10"
                                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}
                    <div className="pt-8 px-4">
                        <Button variant="ghost" className="w-full justify-start text-rose-500 font-bold hover:bg-rose-50 hover:text-rose-600 gap-3 px-2">
                            <LogOut className="w-4 h-4" /> Sair do Sistema
                        </Button>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-9 space-y-10">
                    {activeTab === 'perfil' && (
                        <div className="space-y-10">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 px-2">
                                    <User className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-serif font-bold">Informações Básicas</h3>
                                </div>
                                <Card className="border-border/50 bg-white rounded-[2.5rem] p-8 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</Label>
                                            <Input defaultValue={professor.nome} className="h-12 rounded-xl bg-slate-50/50 border-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail Institucional</Label>
                                            <Input defaultValue={professor.email} className="h-12 rounded-xl bg-slate-50/50 border-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Telefone / WhatsApp</Label>
                                            <Input placeholder="+55 (11) 99999-9999" className="h-12 rounded-xl bg-slate-50/50 border-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Idioma do Sistema</Label>
                                            <div className="h-12 rounded-xl bg-slate-50/50 border border-slate-200 flex items-center px-4 justify-between group cursor-pointer hover:bg-white transition-all">
                                                <span className="text-sm font-medium">Português (Brasil)</span>
                                                <Globe className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-slate-100 mt-8 flex justify-end">
                                        <Button className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">Salvar Alterações</Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Account Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-slate-50 border-none rounded-[2rem] p-6 text-center space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo de Uso</p>
                                    <h4 className="text-3xl font-serif font-black">2.4k h</h4>
                                </Card>
                                <Card className="bg-slate-50 border-none rounded-[2rem] p-6 text-center space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Aulas Ministradas</p>
                                    <h4 className="text-3xl font-serif font-black">452</h4>
                                </Card>
                                <Card className="bg-slate-50 border-none rounded-[2rem] p-6 text-center space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Projetos Ativos</p>
                                    <h4 className="text-3xl font-serif font-black text-primary">03</h4>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 px-2">
                                <Settings className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-serif font-bold">Preferências de Ambiente</h3>
                            </div>
                            <Card className="border-border/50 bg-white rounded-[2.5rem] p-4 shadow-sm">
                                {[
                                    { label: 'Modo Escuro (Dark Mode)', desc: 'Alternar entre tema claro e escuro automaticamente.', icon: Moon, active: false },
                                    { label: 'Otimização de Performance', desc: 'Reduzir animações para economizar bateria e processamento.', icon: Zap, active: true },
                                    { label: 'Sugestões de IA em Tempo Real', desc: 'Exibir assistente flutuante durante a criação de planos.', icon: CheckCircle2, active: true },
                                ].map((item, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center justify-between p-6 rounded-3xl transition-all",
                                        i < 2 && "border-b border-slate-50"
                                    )}>
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-800">{item.label}</h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
                                            item.active ? "bg-primary" : "bg-slate-200"
                                        )}>
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                                item.active ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
