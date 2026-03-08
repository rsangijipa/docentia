'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full z-[100] transition-all duration-500 ease-in-out px-4 sm:px-8",
        isScrolled
          ? "top-4"
          : "top-0 py-8"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto rounded-[2rem] transition-all duration-500",
          isScrolled
            ? "bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] py-4 px-8"
            : "bg-transparent py-0 px-0"
        )}
      >
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl tracking-tighter text-slate-900 italic leading-none">Docentia</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mt-1">Sistemas Maestro</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {['Recursos', 'Soluções', 'Preços'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors italic"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/login">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 gap-2 h-12 px-6 rounded-xl border-none bg-transparent">
                <LogIn className="w-4 h-4" />
                Acessar Painel
              </Button>
            </Link>
            <Link href="/registro">
              <Button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-slate-200 border-none hover:bg-primary transition-all group active:scale-95">
                Criar Conta Maestro <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Glass */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[-1] bg-white/95 backdrop-blur-3xl p-10 pt-32 animate-in fade-in duration-500">
          <div className="flex flex-col gap-10 items-center">
            {['Recursos', 'Soluções', 'Preços'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-2xl font-serif font-black italic text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="w-full h-px bg-slate-100 my-4" />
            <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest border-slate-200">
                Acessar Painel
              </Button>
            </Link>
            <Link href="/registro" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest border-none">
                Criar Conta Maestro
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
