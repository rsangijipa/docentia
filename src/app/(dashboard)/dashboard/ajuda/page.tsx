'use client';

import * as React from 'react';
import {
    HelpCircle,
    Book,
    MessageCircle,
    Mail,
    ExternalLink,
    Search,
    ChevronRight,
    Sparkles,
    Zap,
    ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const faqs = [
    {
        question: "Como cadastrar novos alunos?",
        answer: "Vá para a página de Alunos e clique no botão 'Matricular Novo Aluno'. Preencha os dados básicos e a matrícula será gerada automaticamente."
    },
    {
        question: "Como integrar com a BNCC?",
        answer: "Ao criar um Plano de Aula, você pode pesquisar códigos da BNCC diretamente no campo de 'Objetivos'. O sistema sugere habilidades baseadas na sua disciplina."
    },
    {
        question: "Onde vejo minhas pendências?",
        answer: "No seu Dashboard principal e na aba 'Minha Semana', o Docentia AI as agrupa automaticamente por prioridade."
    },
    {
        question: "Posso exportar meus diários?",
        answer: "Sim, na página de Exportações você pode gerar arquivos PDF ou Excel de todos os seus registros de classe."
    }
];

export default function AjudaPage() {
    const [search, setSearch] = React.useState('');

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-24">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-16 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 gap-12 transition-all hover:border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="space-y-6 text-center md:text-left relative z-10">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                        <HelpCircle className="w-4 h-4" />
                        Centro de Suporte
                    </div>
                    <h1 className="text-6xl lg:text-7xl font-serif font-black italic tracking-tight text-slate-900 leading-tight">Como podemos<br />ajudar?</h1>
                    <p className="text-slate-500 max-w-xl text-xl font-medium leading-relaxed italic">
                        Encontre respostas rápidas para suas dúvidas ou entre em contato com nosso time pedagógico.
                    </p>

                    <div className="relative max-w-lg mx-auto md:mx-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquise por uma funcionalidade..."
                            className="h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white shadow-inner text-lg font-medium italic transition-all"
                        />
                    </div>
                </div>

                <div className="hidden lg:block relative group">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                    <div className="relative bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl space-y-6 border border-slate-800">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-white text-xl font-black italic font-serif">Docentia AI</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Nosso assistente está aprendendo a responder suas dúvidas em tempo real.</p>
                        </div>
                        <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[10px]">
                            Chat em breve
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Book, title: "Guia Rápido", desc: "Aprenda o essencial em 5 minutos", color: "indigo" },
                    { icon: MessageCircle, title: "Fale Conosco", desc: "Suporte via WhatsApp", color: "emerald" },
                    { icon: Mail, title: "E-mail", desc: "Resposta em até 24h úteis", color: "violet" }
                ].map((item, i) => (
                    <Card key={i} className="group hover:shadow-2xl transition-all duration-700 border-slate-100 bg-white rounded-[3rem] overflow-hidden cursor-pointer">
                        <CardContent className="p-10 text-center space-y-6">
                            <div className={`w-20 h-20 bg-${item.color}-50 rounded-[2rem] flex items-center justify-center mx-auto group-hover:rotate-6 transition-all duration-500`}>
                                <item.icon className={`w-10 h-10 text-${item.color}-500`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic font-serif text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 font-medium italic">{item.desc}</p>
                            </div>
                            <Button variant="ghost" className="text-primary font-black uppercase tracking-widest text-[10px] gap-2">
                                Acessar agora <ChevronRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-8">
                <h2 className="text-3xl font-serif font-black italic text-slate-900 px-4">Perguntas Frequentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFaqs.map((faq, i) => (
                        <Card key={i} className="border-slate-100 rounded-[2.5rem] bg-white hover:border-primary/20 transition-all shadow-sm">
                            <CardContent className="p-10 space-y-4">
                                <h4 className="text-xl font-bold text-slate-900 flex items-start gap-3">
                                    <div className="w-1.5 h-6 bg-primary rounded-full shrink-0 mt-0.5" />
                                    {faq.question}
                                </h4>
                                <p className="text-slate-500 font-medium leading-relaxed italic pl-4.5">
                                    {faq.answer}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
