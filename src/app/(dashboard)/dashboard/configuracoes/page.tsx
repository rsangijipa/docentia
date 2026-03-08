'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, School, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'escola', label: 'Escola', icon: School },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
];

export default function ConfiguracoesPage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [nome, setNome] = useState(user?.name ?? '');
    const [escola, setEscola] = useState('');
    const [disciplina, setDisciplina] = useState('');

    // Sincronizar estado quando o usuário carregar
    useState(() => {
        if (user?.name) setNome(user.name);
    });

    if (loading) return null;
    if (!user) return null;

    const handleSave = () => {
        toast.success('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
                <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Configurações</h1>
                <p className="text-muted-foreground mt-1 text-sm">Gerencie seu perfil, escola e preferências.</p>
            </div>

            <div className="flex gap-1 bg-muted/60 p-1 rounded-xl w-fit flex-wrap">
                {tabs.map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'perfil' && (
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="font-serif text-base">Dados Pessoais</CardTitle>
                        <CardDescription>Suas informações de identificação na plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Avatar */}
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-2xl">
                                {user.name?.charAt(0).toUpperCase() ?? 'P'}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{user.name ?? 'Professor'}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                <Button variant="outline" size="sm" className="mt-2 text-xs border-border/60 text-muted-foreground h-7">
                                    Alterar foto
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label>Nome completo</Label>
                                <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Email</Label>
                                <Input value={user?.email ?? ''} disabled className="opacity-60 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label>Disciplina principal</Label>
                                <Input value={disciplina} onChange={e => setDisciplina(e.target.value)} placeholder="Ex: Matemática" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Regime de trabalho</Label>
                                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                                    <option>Efetivo</option>
                                    <option>Contratado</option>
                                    <option>Professor Substituto</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                                <Save className="w-4 h-4" />
                                Salvar Alterações
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'escola' && (
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="font-serif text-base">Dados da Escola</CardTitle>
                        <CardDescription>Configure a escola base para seu escritório pedagógico.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5 sm:col-span-2">
                                <Label>Nome da Escola</Label>
                                <Input value={escola} onChange={e => setEscola(e.target.value)} placeholder="Ex: EMEF Prof. João Silva" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Município</Label>
                                <Input placeholder="Ex: São Paulo" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Estado</Label>
                                <Input placeholder="Ex: SP" maxLength={2} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Rede de Ensino</Label>
                                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                                    <option>Municipal</option>
                                    <option>Estadual</option>
                                    <option>Federal</option>
                                    <option>Privada</option>
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Ano Letivo</Label>
                                <Input placeholder="2026" defaultValue="2026" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                                <Save className="w-4 h-4" />
                                Salvar Escola
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'notificacoes' && (
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="font-serif text-base">Preferências de Notificação</CardTitle>
                        <CardDescription>Escolha quais avisos e lembretes você quer receber.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: 'Diários de classe pendentes', sub: 'Lembrete diário para registros em aberto' },
                            { label: 'Eventos próximos', sub: 'Aviso 24h antes de provas e reuniões' },
                            { label: 'Planos de aula sem data', sub: 'Planos rascunho sem data definida' },
                            { label: 'Novidades da plataforma', sub: 'Atualizações e novas funcionalidades' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} onChange={() => toast.success('Preferência atualizada')} />
                                    <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                                </label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {activeTab === 'seguranca' && (
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="font-serif text-base">Segurança da Conta</CardTitle>
                        <CardDescription>Gerencie sua senha e sessões ativas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label>Senha atual</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Nova senha</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Confirmar nova senha</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => toast.info('Alteração de senha disponível após integração com Firebase.')} className="bg-primary hover:bg-primary/90 gap-2">
                                <Shield className="w-4 h-4" />
                                Alterar Senha
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
