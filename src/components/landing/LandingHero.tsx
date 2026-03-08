'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, GraduationCap, Users, BookmarkCheck } from 'lucide-react';

export function LandingHero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden bg-[#fafafa]">
            {/* Dynamic Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[5%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-violet-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-5xl mx-auto space-y-10 lg:space-y-14">

                    {/* Elite Micro-Badge */}
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            Gestão Pedagógica 4.0
                        </span>
                    </div>

                    {/* Epic Headline */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-serif font-black text-slate-900 tracking-tighter leading-[0.85] italic group">
                            O seu escritório <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 pb-2">
                                pedagógico definitivo.
                                <div className="absolute bottom-4 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed italic opacity-80 animate-in fade-in duration-1000 delay-300">
                            Sincronize BNCC, planos de aula e diários de classe em um único ecossistema inteligente, desenhado para professores que buscam excelência sem burocracia.
                        </p>
                    </div>

                    {/* High-Impact Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/registro" className="w-full sm:w-auto transform hover:scale-[1.03] active:scale-95 transition-all">
                            <Button size="lg" className="w-full md:w-auto h-20 px-14 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] gap-5 shadow-2xl shadow-slate-300 border-none hover:bg-primary transition-all group">
                                Digitalizar minha rotina <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#recursos" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full md:w-auto h-20 px-14 rounded-[2rem] border-slate-200 bg-white text-slate-600 font-black text-xs uppercase tracking-[0.2em] gap-3 hover:bg-slate-50 transition-all shadow-sm">
                                Explorar Ecossistema
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof Trust Bar */}
                    <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 cursor-default">
                        <div className="flex items-center justify-center gap-3">
                            <BookmarkCheck className="w-5 h-5" />
                            <span className="font-black text-[10px] tracking-widest uppercase">BNCC 2026</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-black text-[10px] tracking-widest uppercase">Privacidade Total</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <GraduationCap className="w-5 h-5" />
                            <span className="font-black text-[10px] tracking-widest uppercase">Interface Maestro</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 font-serif font-black text-2xl italic">
                            Docentia.
                        </div>
                    </div>
                </div>

                {/* Feature Component Preview - Premium Card Visual */}
                <div className="mt-32 relative max-w-6xl mx-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                    <div className="relative p-3 rounded-[3.5rem] bg-white border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="bg-slate-50 rounded-[2.75rem] aspect-[16/8] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

                            <div className="z-10 text-center space-y-6 max-w-sm px-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl shadow-slate-200 flex items-center justify-center mx-auto border border-slate-100 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                    <Users className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-black italic text-slate-900 mb-2">Workspace Unificado</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        A primeira interface desenhada para a ergonomia do professor moderno. Tudo o que você precisa a um toque de distância.
                                    </p>
                                </div>
                            </div>

                            {/* Decorative elements representing app interface dots */}
                            <div className="absolute top-10 left-10 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
