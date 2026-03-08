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
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-white rounded-2xl">
                    <div className="relative flex items-center border-b border-border/50 px-4 py-3">
                        <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-primary" />
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="O que você está procurando?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground">
                            ESC
                        </div>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted">
                        {filteredActions.length > 0 ? (
                            <div className="space-y-4 py-2">
                                {['Navegação', 'Ações', 'Sistema'].map(category => {
                                    const catActions = filteredActions.filter(a => a.category === category);
                                    if (catActions.length === 0) return null;
                                    return (
                                        <div key={category} className="space-y-1">
                                            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{category}</p>
                                            {catActions.map((action) => (
                                                <div
                                                    key={action.label}
                                                    onClick={() => onSelect(action.href)}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 cursor-pointer group transition-colors"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <action.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="flex-1 text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground">Nenhum resultado encontrado para "{query}"</p>
                                <p className="text-xs text-muted-foreground mt-1">Tente pesquisar por uma funcionalidade ou comando.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><CommandIcon className="w-3 h-3" /> Navegar</span>
                            <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Selecionar</span>
                        </div>
                        <span>Docentia v1.2</span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
