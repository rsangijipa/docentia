'use client';

import Link from 'next/link';
import { CheckCircle2, Zap, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LandingPricing() {
    const plans = [
        {
            name: 'Mensal Maestro',
            price: '19,90',
            period: 'mês',
            description: 'Liberdade e organização total para o seu mês letivo.',
            features: [
                'Turmas e alunos ilimitados',
                'Biblioteca BNCC 2026 completa',
                'Geração de PDFs e Excel oficiais',
                'Acesso ao Painel de Controle',
            ],
            cta: 'Assinar Plano Mensal',
            popular: false,
        },
        {
            name: 'Anual Elite',
            price: '200,00',
            period: 'ano',
            description: 'A escolha dos professores que planejam o sucesso.',
            features: [
                'Todos os recursos do plano mensal',
                'Dois meses de economia real',
                'Suporte prioritário via WhatsApp',
                'Backup vitalício de dados',
            ],
            cta: 'Assinar Plano Anual',
            popular: true,
        },
    ];

    return (
        <section id="preços" className="py-32 lg:py-52 bg-[#0f172a] relative overflow-hidden">
            {/* Premium Background Noise & Gradients */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">
                        <ShieldCheck className="w-4 h-4" /> Investimento Seguro
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-serif font-black text-white tracking-tighter leading-none italic">
                        O seu bem-estar <br />
                        <span className="text-blue-500">não tem preço.</span>
                    </h2>
                    <p className="text-slate-400 font-medium leading-relaxed italic opacity-80">
                        Interface 100% limpa, sem anúncios e focada na sua produtividade. Escolha o ritmo que combina com sua carreira.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                "relative group p-1 split-border rounded-[3rem] transition-all duration-700",
                                plan.popular ? "bg-gradient-to-b from-blue-500/50 to-indigo-600/50 shadow-2xl shadow-blue-500/10 scale-105 z-10" : "bg-white/5 border border-white/10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Star className="w-3 h-3 fill-white" /> Recomendado
                                </div>
                            )}

                            <div className={cn(
                                "h-full p-10 lg:p-14 rounded-[2.8rem] flex flex-col",
                                plan.popular ? "bg-[#0f172a] text-white" : "bg-transparent text-white"
                            )}>
                                <div className="mb-10">
                                    <h3 className="text-2xl font-serif font-black italic mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-xs font-medium italic">{plan.description}</p>
                                </div>

                                <div className="flex items-baseline gap-2 mb-12">
                                    <span className="text-sm font-black text-slate-500 uppercase">R$</span>
                                    <span className="text-7xl font-serif font-black tracking-tighter italic">{plan.price.split(',')[0]}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-blue-500">,{plan.price.split(',')[1]}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">/{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-5 mb-14 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4 group/item">
                                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors", plan.popular ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-slate-400")}>
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 group-hover/item:text-white transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/registro" className="block w-full">
                                    <Button
                                        size="lg"
                                        className={cn(
                                            "w-full h-18 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 border-none",
                                            plan.popular ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                        )}
                                    >
                                        {plan.cta} <Zap className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secure Transaction Link */}
                <div className="mt-20 text-center space-y-4 opacity-40">
                    <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Pagamento Criptografado</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                        <span>Cancelamento a qualquer momento</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
