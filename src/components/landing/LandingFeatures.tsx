'use client';

import { CalendarDays, BookOpen, Target, FileSpreadsheet, ShieldCheck, Zap, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingFeatures() {
    const features = [
        {
            icon: CalendarDays,
            title: 'Maestro de Cronogramas',
            description: 'Gestão dinâmica de feriados e conselhos de classe. O sistema sincroniza sua carga horária automaticamente.',
            accent: 'text-indigo-600',
            bg: 'bg-indigo-50/50',
        },
        {
            icon: BookOpen,
            title: 'Curadoria PNLD 2026',
            description: 'Vincule conteúdos aos capítulos do livro didático. Saiba exatamente onde cada turma parou no programa.',
            accent: 'text-blue-600',
            bg: 'bg-blue-50/50',
        },
        {
            icon: Target,
            title: 'Motor de Inteligência BNCC',
            description: 'Habilidades indexadas por tema. Sugestões instantâneas para planos de aula com vinculação pedagógica real.',
            accent: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
        },
        {
            icon: FileSpreadsheet,
            title: 'Relatórios de Auditoria',
            description: 'Exportação perfeita em PDF e Excel nos padrões oficiais da sua rede. Importe dados da secretaria sem erros.',
            accent: 'text-rose-600',
            bg: 'bg-rose-50/50',
        },
    ];

    return (
        <section id="recursos" className="py-32 lg:py-48 bg-white relative overflow-hidden">
            {/* Decorative Geometric Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-12 translate-x-24 -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
                    <div className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <Sparkles className="w-4 h-4" /> Ecossistema Funcional
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-serif font-black text-slate-900 tracking-tighter leading-none italic">
                            Recupere os seus <br />
                            <span className="text-primary">finais de semana.</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-8">
                        A rotina real não é linear. A Docentia estrutura o caos pedagógico em um fluxo de trabalho unificado que economiza até 15h semanais.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", feature.bg, feature.accent)}>
                                <feature.icon className="w-8 h-8" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-serif font-black italic text-slate-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Index Number */}
                            <div className="absolute top-10 right-10 text-[10px] font-black text-slate-100 group-hover:text-primary/10 transition-colors uppercase tracking-widest">
                                Mod. 0{idx + 1}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Global Stats Micro-Banner */}
                <div className="mt-24 p-8 lg:p-12 rounded-[3rem] bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-blue-600/10 blur-[80px] group-hover:scale-125 transition-transform duration-1000" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center backdrop-blur-xl">
                            <Zap className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Desempenho Docente</p>
                            <h4 className="text-2xl font-serif font-black italic">Operação em Tempo Real</h4>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 relative z-10">
                        <div className="text-center">
                            <p className="text-3xl font-serif font-black italic">600k+</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Planos Gerados</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-serif font-black italic">98%</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fidelidade BNCC</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-serif font-black italic">ZERO</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Perda de Dados</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
