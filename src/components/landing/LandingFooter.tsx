'use client';

import Link from 'next/link';
import { ShieldCheck, GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-white border-t border-slate-100 py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24 mb-20">

                    <div className="md:col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center p-2 shadow-xl transition-all group-hover:scale-105 group-hover:rotate-2">
                                <img src="/logo.png" className="w-full h-full object-contain brightness-0 invert" alt="Docentia" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif font-black text-xl tracking-tighter text-slate-900 italic leading-none">Docentia</span>
                                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-primary mt-1">Sistemas Maestro</span>
                            </div>
                        </Link>
                        <p className="max-w-sm text-sm text-slate-500 font-medium leading-relaxed italic opacity-80">
                            O ecossistema definitivo para a gestão pedagógica de alto desempenho. Desenhado por e para professores que buscam excelência sem burocracia.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Plataforma</h4>
                        <ul className="space-y-4">
                            {['Recursos', 'Soluções', 'Preços', 'Updates'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors italic">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacidade', 'Termos', 'Segurança', 'Contato'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors italic">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        © {new Date().getFullYear()} Docentia Systems. Proprietary Intellectual Property.
                    </p>
                    <div className="flex items-center gap-2 text-slate-400 italic font-serif font-black text-sm">
                        <GraduationCap className="w-4 h-4" />
                        Empoderando Educadores.
                    </div>
                </div>
            </div>
        </footer>
    );
}
