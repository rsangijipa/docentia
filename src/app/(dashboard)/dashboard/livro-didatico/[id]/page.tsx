'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    BookOpen,
    Loader2,
    CheckCircle2,
    Clock,
    MoreVertical,
    Plus,
    Trash2,
    Calendar,
    Users,
    Layout
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TextbookServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function TextbookDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: book, isLoading: loadingBook } = useQuery({
        queryKey: ['textbook', id],
        queryFn: () => TextbookServiceFB.getById(id),
        enabled: !!id
    });

    const { data: turmas = [] } = useQuery({
        queryKey: ['classrooms'],
        queryFn: () => ClassroomServiceFB.getByTeacher(book?.teacherId),
        enabled: !!book?.teacherId
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => TextbookServiceFB.update(id, data),
        onSuccess: () => {
            toast.success('Progresso atualizado!');
            queryClient.invalidateQueries({ queryKey: ['textbook', id] });
        }
    });

    if (loadingBook) {
        return (
            <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
                <Loader2 className='w-12 h-12 text-primary animate-spin' />
                <p className='text-zinc-500 font-medium font-serif italic'>Consultando sumário pedagógico...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className='h-[60vh] flex flex-col items-center justify-center space-y-6'>
                <div className='h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300'>
                    <BookOpen className='w-10 h-10' />
                </div>
                <div className='text-center space-y-2'>
                    <h2 className='text-2xl font-serif font-black italic'>Livro não encontrado</h2>
                    <p className='text-slate-500'>O material solicitado não existe ou você não tem acesso.</p>
                </div>
                <Button variant='outline' onClick={() => router.push('/dashboard/livro-didatico')} className='rounded-xl'>
                    <ArrowLeft className='w-4 h-4 mr-2' /> Voltar para Biblioteca
                </Button>
            </div>
        );
    }

    const chapters = book.chapters || [
        { id: 1, title: 'Capítulo 1: Fundamentação', status: 'completed', progress: 100 },
        { id: 2, title: 'Capítulo 2: Operações Básicas', status: 'completed', progress: 100 },
        { id: 3, title: 'Capítulo 3: Geometria Espacial', status: 'in-progress', progress: 45 },
        { id: 4, title: 'Capítulo 4: Álgebra Linear', status: 'pending', progress: 0 },
        { id: 5, title: 'Capítulo 5: Estatística Aplicada', status: 'pending', progress: 0 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-24">
            {/* Header Premium (Similiar to main page but with Back button) */}
            <div className="flex flex-col gap-10 bg-slate-900 p-12 md:p-16 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32" />

                <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6'>
                    <div className="space-y-6">
                        <Button
                            variant='ghost'
                            onClick={() => router.push('/dashboard/livro-didatico')}
                            className='text-slate-400 hover:text-white hover:bg-white/5 -ml-4 gap-2 transition-all p-4 rounded-2xl'
                        >
                            <ArrowLeft className='w-4 h-4' /> Voltar para Biblioteca
                        </Button>
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <Badge className='bg-primary/20 text-primary border-none text-[8px]'>{book.materia}</Badge>
                            ISBN: {book.isbn || 'N/A'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter leading-tight">{book.titulo}</h1>
                    </div>

                    <div className='bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl min-w-[280px] space-y-4'>
                        <div className='flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-slate-400'>
                            <span>Cobertura do Ano</span>
                            <span className='text-white'>{book.progressoMedio || 0}%</span>
                        </div>
                        <Progress value={book.progressoMedio || 0} className='h-2 bg-white/10' />
                        <div className='flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                            <div className='flex items-center gap-1.5'><Clock className='w-3 h-3 text-primary' /> {chapters.filter((c: any) => c.status === 'completed').length} Concluídos</div>
                            <div className='flex items-center gap-1.5'><CheckCircle2 className='w-3 h-3 text-emerald-400' /> {chapters.length} Totais</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 px-4'>
                {/* Chapters List */}
                <div className='lg:col-span-2 space-y-8'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-3xl font-serif font-black italic text-slate-900'>Cronograma de Conteúdo</h2>
                        <Button variant='outline' className='rounded-xl text-[10px] font-black uppercase tracking-widest gap-2'>
                            <Plus className='w-4 h-4' /> Adicionar Capítulo
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        {chapters.map((chapter: any, idx: number) => (
                            <Card key={chapter.id} className='group border-none bg-white rounded-[2.5rem] shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all duration-300'>
                                <CardContent className='p-8 flex items-center justify-between gap-6'>
                                    <div className='flex items-center gap-6'>
                                        <div className={cn(
                                            'h-14 w-14 rounded-2xl flex items-center justify-center font-serif font-black italic text-xl shadow-inner',
                                            chapter.status === 'completed' ? 'bg-emerald-50 text-emerald-500' :
                                                chapter.status === 'in-progress' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div className='space-y-1'>
                                            <h3 className='text-lg font-bold text-slate-800 leading-tight'>{chapter.title}</h3>
                                            <div className='flex items-center gap-3'>
                                                <Badge variant='outline' className={cn(
                                                    'text-[8px] font-black uppercase tracking-tighter border-none',
                                                    chapter.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                        chapter.status === 'in-progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                                                )}>
                                                    {chapter.status === 'completed' ? 'Finalizado' : chapter.status === 'in-progress' ? 'Em Aula' : 'Pendente'}
                                                </Badge>
                                                <span className='text-[10px] text-slate-400 font-medium font-serif italic'>Atualizado em {formatDate(new Date().toISOString())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-8'>
                                        <div className='hidden md:block w-32 space-y-2'>
                                            <div className='flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400'>
                                                <span>Frequência</span>
                                                <span>{chapter.progress}%</span>
                                            </div>
                                            <Progress value={chapter.progress} className='h-1.5' />
                                        </div>
                                        <Button variant='ghost' size='icon' className='text-slate-300 hover:text-primary rounded-xl'>
                                            <MoreVertical className='w-5 h-5' />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Contextual */}
                <div className='space-y-8'>
                    <Card className='rounded-[3rem] border-none shadow-2xl overflow-hidden'>
                        <div className='bg-violet-600 p-10 text-white space-y-6'>
                            <Layout className='w-12 h-12 opacity-50' />
                            <div className='space-y-2'>
                                <h4 className='text-2xl font-serif font-black italic italic'>Vincular Turmas</h4>
                                <p className='text-violet-100 text-sm opacity-80 leading-relaxed font-medium'>Este material está disponível para consulta nas turmas selecionadas.</p>
                            </div>
                            <div className='space-y-3'>
                                {turmas.map((turma: any) => (
                                    <div key={turma.id} className='flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10'>
                                        <span className='text-xs font-bold'>{turma.nome}</span>
                                        <Badge className='bg-white/20 text-white text-[9px] border-none'>Ativo</Badge>
                                    </div>
                                ))}
                                <Button className='w-full bg-white text-violet-600 hover:bg-violet-50 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl mt-4 shadow-xl'>
                                    Gerenciar Turmas
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className='rounded-[3rem] p-10 bg-slate-50 border-none space-y-6'>
                        <div className='flex items-center gap-3 text-slate-900'>
                            <CheckCircle2 className='w-6 h-6 text-primary' />
                            <h4 className='text-xl font-serif font-black italic italic'>Análise de Cobertura</h4>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-4 text-sm font-medium text-slate-600'>
                                <Users className='w-4 h-4' />
                                <span>124 Alunos Consultaram</span>
                            </div>
                            <div className='flex items-center gap-4 text-sm font-medium text-slate-600'>
                                <Calendar className='w-4 h-4' />
                                <span>Último uso há 2 dias</span>
                            </div>
                        </div>
                        <p className='text-xs text-slate-400 font-medium leading-relaxed italic'>
                            O progresso médio é calculado com base nos planos de aula que referenciam este material.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
