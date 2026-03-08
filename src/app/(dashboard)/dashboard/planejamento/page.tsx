'use client';

import * as React from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    BookMarked,
    FileText,
    Calendar,
    Target,
    GraduationCap,
    BookOpen,
    ArrowRight,
    ChevronRight,
    ClipboardCheck,
    LayoutDashboard,
    Layers,
    Sparkles,
    AlertCircle,
    Users,
    BarChart3,
    MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMockData } from '@/hooks/use-mock-data';

export default function PlanejamentoHub() {
    const { coursePlans, lessonPlans, textbooks } = useMockData();

    const activeCoursePlan = coursePlans[0];
    const upcomingLessons = lessonPlans.filter(l => l.status === 'planejado');

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm tracking-wide uppercase">Hub Pedagógico</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">
                        Centro de Planejamento
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Sincronize seu plano de curso, aulas semanais e o progresso do livro didático em um só lugar.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href="/dashboard/planos-aula" className="flex-1 md:flex-none">
                        <Button className="w-full gap-2 bg-primary shadow-sm hover:translate-y-[-1px] transition-transform">
                            <Plus className="w-4 h-4" /> Novo Plano
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Area - Course & Lessons */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Active Course Plan Card */}
                    <Card className="border-border/50 overflow-hidden shadow-sm group">
                        <div className="h-2 bg-slate-800" />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <BookMarked className="w-5 h-5 text-primary" />
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">Plano de Curso Ativo</Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-serif">{activeCoursePlan.titulo}</CardTitle>
                                </div>
                                <Link href={`/dashboard/planos-curso`}>
                                    <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/5">
                                        Editar Estrutura <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Turma', value: '8º Ano A', icon: Users },
                                    { label: 'Disciplina', value: 'Matemática', icon: BookOpen },
                                    { label: 'Unidades', value: '4 Bimestres', icon: Layers },
                                    { label: 'BNCC', value: '12 Habilidades', icon: GraduationCap },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex flex-col gap-2">
                                        <item.icon className="w-4 h-4 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                                            <p className="text-sm font-bold truncate">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progresso do Conteúdo Anual</h4>
                                    <span className="text-sm font-bold text-primary">35%</span>
                                </div>
                                <Progress value={35} className="h-2 shadow-inner" />
                                <p className="text-xs text-muted-foreground italic">
                                    <span className="font-bold text-foreground">Aviso:</span> Você está finalizando a Unidade 1. Lembre-se de vincular a avaliação bimestral.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Planning Preview (Simulated Drag & Drop Look) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Planejamento Semanal
                            </h2>
                            <Button variant="outline" size="sm" className="text-xs gap-2">
                                Modo Grade <LayoutDashboard className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {upcomingLessons.map((lesson) => (
                                <Card key={lesson.id} className="hover:border-primary/30 transition-all cursor-pointer group shadow-sm border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge className="bg-primary/10 text-primary border-transparent h-5 text-[10px] font-bold uppercase tracking-wider">
                                                Seg, 10 de Mar
                                            </Badge>
                                            <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{lesson.tema}</h4>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="outline" className="text-[10px] font-mono font-bold text-primary">{lesson.habilidadeBNCC}</Badge>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{lesson.periodo} Horas/Aula</span>
                                        </div>
                                        <div className="pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
                                            <div className="flex -space-x-1">
                                                <div className="w-6 h-6 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-violet-700" title="Livro Disponível">L</div>
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-emerald-700" title="BNCC Vinculada">B</div>
                                            </div>
                                            <Link href={`/dashboard/planos-aula`}>
                                                <Button variant="ghost" size="sm" className="h-8 p-0 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-transparent">
                                                    Ver Detalhes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="border-2 border-dashed border-border/50 bg-muted/5 flex flex-col items-center justify-center p-8 text-center hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nova Aula</p>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Strategy & Health */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Consistency Assistant */}
                    <Card className="border-emerald-100 bg-emerald-50/20 shadow-sm overflow-hidden ring-1 ring-emerald-50">
                        <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100 flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <CardTitle className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Assistente de Consistência</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {[
                                { title: 'Habilidade Faltante', desc: 'A aula de Geometria (Qua) está sem BNCC vinculada.', type: 'warning' },
                                { title: 'Conflito de Calendário', desc: 'Sexta-feira (13/03) há feriado municipal.', type: 'info' },
                                { title: 'Livro Didático', desc: 'Capítulo 4 ainda não tem aula associada.', type: 'suggestion' },
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-3 group cursor-pointer">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${alert.type === 'warning' ? 'bg-amber-500' : 'bg-primary'}`} />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold group-hover:text-primary transition-colors">{alert.title}</p>
                                        <p className="text-[10px] text-muted-foreground leading-tight">{alert.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-3 bg-emerald-50/30 border-t border-emerald-100 text-center">
                            <Button variant="ghost" className="w-full text-[10px] font-bold uppercase text-emerald-700 hover:text-emerald-900">Validar Todo o Bimetre</Button>
                        </div>
                    </Card>

                    {/* Quick Navigator */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-4 border-b border-border/50 bg-slate-900 text-white rounded-t-xl">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Acesso Direto</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 grid grid-cols-2 gap-3">
                            {[
                                { label: 'BNCC Lib', href: '/dashboard/bncc', icon: GraduationCap },
                                { label: 'Livro Foco', href: '/dashboard/livro-didatico', icon: BookOpen },
                                { label: 'Turmas', href: '/dashboard/turmas', icon: Users },
                                { label: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
                            ].map((nav, i) => (
                                <Link key={i} href={nav.href}>
                                    <div className="p-3 rounded-xl border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all flex flex-col items-center gap-2">
                                        <nav.icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-[10px] font-bold text-foreground truncate w-full text-center">{nav.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Book Tracker mini */}
                    {textbooks.slice(0, 1).map(book => (
                        <Card key={book.id} className="border-border/50 overflow-hidden">
                            <CardHeader className="p-5 pb-3 bg-muted/20 border-b border-border/40 flex-row items-center justify-between space-y-0">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{book.subject}</p>
                                <Badge variant="outline" className="h-4 text-[8px] font-bold bg-white">Volume 1</Badge>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">{book.title}</p>
                                    <p className="text-[10px] text-muted-foreground">Progresso: Cap. {book.currentChapter} de {book.totalChapters}</p>
                                </div>
                                <Progress value={book.progress} className="h-1" />
                                <div className="flex justify-center">
                                    <Button variant="link" className="text-[10px] font-bold text-primary group uppercase">
                                        Gerenciar Capítulos <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
}
