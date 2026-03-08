'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  BookOpen,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  BookMarked,
  FileSpreadsheet,
  ChevronRight,
  Menu,
  X,
  Loader2,
  GraduationCap,
  Bell,
  Sparkles,
  CalendarDays,
  AlertCircle,
  CheckSquare,
  FileSearch,
  Layout,
  HelpCircle,
  Zap,
  FileUp,
  MoreVertical,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/dashboard/CommandPalette';

type NavItem = {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  badge?: string;
  isNew?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'Painel',
    items: [
      { href: '/dashboard', label: 'Início', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/minha-semana', label: 'Minha Semana', icon: CalendarDays },
      { href: '/dashboard/notificacoes', label: 'Notificações', icon: Bell },
    ]
  },
  {
    title: 'Gestão Pedagógica',
    items: [
      { href: '/dashboard/calendario', label: 'Calendário Escolar', icon: Calendar },
      { href: '/dashboard/turmas', label: 'Turmas', icon: Users },
      { href: '/dashboard/alunos', label: 'Alunos', icon: GraduationCap },
      { href: '/dashboard/planejamento', label: 'Planejamento', icon: Sparkles },
      { href: '/dashboard/diario', label: 'Diário de Classe', icon: ClipboardList },
      { href: '/dashboard/bncc', label: 'BNCC Explorer', icon: FileSearch },
      { href: '/dashboard/livro-didatico', label: 'Livro Didático', icon: BookOpen },
      { href: '/dashboard/projetos', label: 'Projetos Pedagógicos', icon: FileSpreadsheet },
    ]
  },
  {
    title: 'Avaliação e Documentos',
    items: [
      { href: '/dashboard/avaliacoes', label: 'Avaliações', icon: CheckSquare },
      { href: '/dashboard/relatorios', label: 'Relatórios', icon: BarChart3 },
      { href: '/dashboard/templates', label: 'Templates', icon: Layout },
      { href: '/dashboard/exportacoes', label: 'Exportações', icon: FileUp },
    ]
  },
  {
    title: 'Inteligência e Apoio',
    items: [
      { href: '/dashboard/consistencia', label: 'Consistência Pedagógica', icon: Zap },
      { href: '/dashboard/ajuda', label: 'Ajuda', icon: HelpCircle },
    ]
  }
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Painel': true,
    'Gestão Pedagógica': true
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground font-serif italic font-bold text-3xl shadow-2xl animate-pulse">
            D
          </div>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest animate-fade-in">Docentia Office</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const allItems = navGroups.flatMap(g => g.items);
  const currentPage = allItems.find(item => isActive(pathname, item.href, item.exact));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* ─── Mobile Overlay ─── */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] transition-opacity duration-300 lg:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* ─── Sidebar / Drawer Mobile ─── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-[85vw] sm:w-80 h-full flex flex-col z-[70] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0',
          'bg-white border-r border-slate-200/60',
          isMobileOpen ? 'translate-x-0 shadow-[20px_0_50px_-10px_rgba(0,0,0,0.1)]' : '-translate-x-full'
        )}
      >
        {/* Mobile Header Sidebar */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-slate-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-serif font-black text-xl italic shadow-lg">D</div>
            <span className="font-serif font-bold text-xl tracking-tight text-slate-800">Docentia</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-10 w-10 border border-slate-100" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5 text-slate-400" />
          </Button>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-8 scrollbar-hide">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-4 mb-2 group"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {group.title}
                </p>
                <ChevronDown className={cn("w-3 h-3 text-slate-300 transition-transform", !expandedGroups[group.title] && "-rotate-90")} />
              </button>

              <div className={cn(
                "space-y-1 transition-all duration-300 overflow-hidden",
                expandedGroups[group.title] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative border border-transparent',
                        active
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 border-slate-800'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-100'
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        active ? "bg-white/10" : "bg-slate-100 group-hover:bg-white"
                      )}>
                        <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900')} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[9px] font-black tracking-tighter">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Sidebar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="p-4 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
              {user.name?.charAt(0).toUpperCase() ?? 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-slate-800 truncate leading-none uppercase tracking-tighter">{user.name ?? 'Professor'}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Nível Maestro</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 lg:ml-80 flex flex-col min-h-screen relative pb-20 lg:pb-0">
        {/* Topbar Mobile & Desktop */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-12 w-12 rounded-2xl border border-slate-100 shadow-sm text-slate-600"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex flex-col">
              <h2 className="text-xl lg:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-none">
                {currentPage?.label ?? 'Escritório'}
              </h2>
              <div className="hidden sm:flex items-center gap-2 mt-1.5 opacity-40">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Março 2026 · Rede Municipal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:block w-72">
              <CommandPalette />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="md:hidden h-12 w-12 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl relative text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
              <div className="hidden sm:block h-10 w-px bg-slate-100 mx-2" />
              <Link href="/dashboard/perfil" className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold hover:scale-105 transition-all shadow-sm">
                {user.name?.charAt(0).toUpperCase() ?? 'P'}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 w-full bg-slate-50 pt-6 pb-12 sm:pt-10 sm:pb-20">
          <div className="container max-w-[1600px] px-6 sm:px-12 mx-auto">
            {children}
          </div>
        </div>

        {/* ─── Mobile Bottom Navigation (Exclusive Mobile) ─── */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 lg:hidden z-50 px-4 flex items-center justify-around shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)]">
          {[
            { label: 'Início', icon: LayoutDashboard, href: '/dashboard', exact: true },
            { label: 'Agenda', icon: CalendarDays, href: '/dashboard/minha-semana' },
            { label: 'Turmas', icon: Users, href: '/dashboard/turmas' },
            { label: 'Diário', icon: ClipboardList, href: '/dashboard/diario' },
            { label: 'Menu', icon: Menu, href: '#menu', onClick: () => setIsMobileOpen(true) },
          ].map((item, i) => {
            const active = item.href === '#menu' ? isMobileOpen : isActive(pathname, item.href, item.exact);
            const Icon = item.icon;

            if (item.href === '#menu') {
              return (
                <button
                  key={i}
                  onClick={item.onClick}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-all w-16 group",
                    active ? "text-primary" : "text-slate-400"
                  )}
                >
                  <Icon className={cn("w-5 h-5 group-active:scale-90 transition-transform")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all w-16 group",
                  active ? "text-slate-900" : "text-slate-400"
                )}
              >
                <div className={cn(
                  "relative transition-all",
                  active && "scale-110"
                )}>
                  <Icon className={cn("w-5 h-5 group-active:scale-90 transition-transform", active && "text-slate-900")} />
                  {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-black uppercase tracking-widest leading-none", active ? "text-slate-900" : "text-slate-400")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
