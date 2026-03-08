'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    FileText,
    Users,
    Calendar,
    Settings,
    Plus,
    ArrowRight,
    BookOpen,
    ClipboardList,
    Target,
    GraduationCap,
    Command as CommandIcon,
    Bell
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const actions = [
        { label: 'Ir para Início', icon: FileText, href: '/dashboard', category: 'Navegação' },
        { label: 'Minha Semana (Pendências)', icon: Calendar, href: '/dashboard/minha-semana', category: 'Navegação' },
        { label: 'Gestão de Alunos', icon: Users, href: '/dashboard/alunos', category: 'Navegação' },
        { label: 'Ver Minhas Turmas', icon: Users, href: '/dashboard/turmas', category: 'Navegação' },
        { label: 'Explorar BNCC', icon: GraduationCap, href: '/dashboard/bncc', category: 'Navegação' },
        { label: 'Planejamento Pedagógico', icon: Target, href: '/dashboard/planejamento', category: 'Navegação' },
        { label: 'Novo Plano de Aula', icon: Plus, href: '/dashboard/planos-aula', category: 'Ações' },
        { label: 'Registrar Presença', icon: ClipboardList, href: '/dashboard/diario', category: 'Ações' },
        { label: 'Pesquisar Livro Didático', icon: BookOpen, href: '/dashboard/livro-didatico', category: 'Navegação' },
        { label: 'Centro de Avaliações', icon: Target, href: '/dashboard/avaliacoes', category: 'Avaliação' },
        { label: 'Auditoria de Consistência', icon: Target, href: '/dashboard/consistencia', category: 'Inteligência' },
        { label: 'Gestão de Projetos', icon: Plus, href: '/dashboard/projetos', category: 'Navegação' },
        { label: 'Meus Templates', icon: FileText, href: '/dashboard/templates', category: 'Documentos' },
        { label: 'Histórico de Exportações', icon: FileText, href: '/dashboard/exportacoes', category: 'Documentos' },
        { label: 'Notificações', icon: Bell, href: '/dashboard/notificacoes', category: 'Sistema' },
        { label: 'Meu Perfil & Configurações', icon: Settings, href: '/dashboard/perfil', category: 'Sistema' },
    ];

    const filteredActions = actions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase()) ||
        action.category.toLowerCase().includes(query.toLowerCase())
    );

    const onSelect = (href: string) => {
        router.push(href);
        setOpen(false);
        setQuery('');
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm group"
            >
                <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="flex-1 text-left">Buscar ou atalho...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted-foreground/10 px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden">
                    <div className="relative flex items-center border-b border-slate-900/5 px-6 py-4 bg-white/50">
                        <Search className="mr-3 h-5 w-5 shrink-0 text-primary animate-pulse" />
                        <input
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-lg font-medium outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="O que você precisa fazer agora?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200 shadow-sm">
                            ESC
                        </div>
                    </div>
                    <div className="max-h-[480px] overflow-y-auto p-3 scrollbar-hide">
                        {filteredActions.length > 0 ? (
                            <div className="space-y-6 py-2">
                                {['Navegação', 'Ações', 'Inteligência', 'Sistema'].map(category => {
                                    const catActions = filteredActions.filter(a => a.category === category);
                                    if (catActions.length === 0) return null;
                                    return (
                                        <div key={category} className="space-y-1.5">
                                            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{category}</p>
                                            {catActions.map((action) => (
                                                <div
                                                    key={action.label}
                                                    onClick={() => onSelect(action.href)}
                                                    className="flex items-center gap-4 px-3 py-3 rounded-[1.25rem] hover:bg-white hover:shadow-xl hover:shadow-primary/5 cursor-pointer group transition-all duration-300 border border-transparent hover:border-primary/10"
                                                >
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                                        <action.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="block text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{action.label}</span>
                                                        <span className="block text-[10px] text-slate-400 font-medium">Atalho rápido para {category.toLowerCase()}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-lg font-serif font-black italic text-slate-900">Sem resultados para &quot;{query}&quot;</p>
                                    <p className="text-sm text-slate-500 mt-1 max-w-[280px] mx-auto">Tente usar termos mais genéricos ou procure no menu lateral.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-5 bg-slate-50/80 border-t border-slate-900/5 flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <kbd className="bg-white border shadow-sm px-1.5 py-0.5 rounded-md text-slate-900">↑↓</kbd> Navegar
                            </span>
                            <span className="flex items-center gap-2">
                                <kbd className="bg-white border shadow-sm px-1.5 py-0.5 rounded-md text-slate-900">ENTER</kbd> Selecionar
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/60">
                            <CommandIcon className="w-3 h-3" />
                            <span>Docentia Intelligence v1.2</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
