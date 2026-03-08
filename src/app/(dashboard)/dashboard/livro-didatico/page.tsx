'use client';

import * as React from 'react';
import {
  Book,
  Bookmark,
  BookOpen,
  Plus,
  Search,
  Users,
  Calendar,
  ArrowLeft,
  Sparkles,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Layout,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TextbookServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';
import Link from 'next/link';

export default function TextbookPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);

  const [newBook, setNewBook] = React.useState({
    titulo: '',
    autor: '',
    materia: '',
    isbn: '',
    turmas: [] as string[],
    progressoMedio: 0
  });

  const { data: textbooks = [], isLoading } = useQuery({
    queryKey: ['textbooks', user?.id],
    queryFn: () => user?.id ? TextbookServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: turmas = [] } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => TextbookServiceFB.create(data),
    onSuccess: () => {
      toast.success('Livro registrado com sucesso!');
      setIsCreateOpen(false);
      setNewBook({ titulo: '', autor: '', materia: '', isbn: '', turmas: [], progressoMedio: 0 });
      queryClient.invalidateQueries({ queryKey: ['textbooks'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TextbookServiceFB.delete(id),
    onSuccess: () => {
      toast.success('Livro removido.');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['textbooks'] });
    }
  });

  const filteredBooks = textbooks.filter((b: any) =>
    b.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.materia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4 font-serif italic'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-zinc-500 font-medium'>Sincronizando biblioteca pedagógica...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32" />

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Book className="w-4 h-4" />
            Repositório de Materiais
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter leading-none">Livro Didático</h1>
          <p className="text-slate-400 max-w-xl text-xl font-medium leading-relaxed italic">
            Faça o acompanhamento granular por capítulo e turma, integrando o material físico à sua jornada digital.
          </p>
        </div>

        <div className="relative z-10">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[11px] gap-3 shadow-2xl transition-all active:scale-95">
                <Plus className="w-5 h-5" /> Adicionar Livro
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-xl p-0 overflow-hidden border-none shadow-3xl rounded-[3rem]'>
              <DialogHeader className="bg-slate-900 text-white py-12 px-10 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <DialogTitle className="text-3xl font-serif font-black italic">Novo Material</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium">Vincule um novo livro didático à sua biblioteca.</DialogDescription>
                </div>
              </DialogHeader>

              <form onSubmit={(e) => { e.preventDefault(); if (user?.id) createMutation.mutate({ ...newBook, teacherId: user.id }); }} className="p-10 space-y-6">
                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Livro</Label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      value={newBook.titulo}
                      onChange={(e) => setNewBook({ ...newBook, titulo: e.target.value })}
                      required
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-5'>
                    <div className='space-y-2'>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matéria/Componente</Label>
                      <Input
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        value={newBook.materia}
                        onChange={(e) => setNewBook({ ...newBook, materia: e.target.value })}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ISBN (Opcional)</Label>
                      <Input
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-6">
                  <Button type='submit' disabled={createMutation.isPending} className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] gap-2 shadow-2xl">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Registro'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
          <button className="px-8 py-3 rounded-xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Biblioteca</button>
          <button className="px-8 py-3 rounded-xl text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">Em Uso</button>
        </div>
        <div className="relative w-full md:w-80 h-14">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar material..."
            className="pl-12 h-full rounded-2xl border-none shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBooks.length > 0 ? filteredBooks.map((book: any) => (
          <Card key={book.id} className="group border-none bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <CardContent className="p-0">
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors duration-500 shadow-inner group-hover:shadow-2xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-200 hover:text-rose-500 rounded-xl" onClick={() => setDeleteTarget(book)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Badge className="bg-indigo-50 text-indigo-600 border-none px-2 h-4 text-[8px] font-black uppercase tracking-widest">{book.materia}</Badge>
                  <h3 className="text-2xl font-serif font-black italic text-slate-900 leading-tight">{book.titulo}</h3>
                  <p className="text-xs text-slate-400 font-medium font-serif italic">ISBN: {book.isbn || 'N/A'}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Progresso do Ano</span>
                    <span className="text-slate-900">{book.progressoMedio || 0}%</span>
                  </div>
                  <Progress value={book.progressoMedio || 5} className="h-2 bg-slate-50" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 group-hover:bg-white transition-colors border-t border-slate-100">
                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary gap-2 hover:bg-transparent">
                  Acessar Conteúdo <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className='col-span-full py-32 flex flex-col items-center justify-center space-y-4 bg-white rounded-[4rem] border border-dashed border-slate-200'>
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
              <Bookmark className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className='text-slate-500 font-black italic text-lg'>Nenhum livro registrado.</p>
              <p className="text-slate-400 text-xs font-medium">Sua biblioteca operacional começa aqui.</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
        title="Remover Material"
        description={deleteTarget ? `Tem certeza que deseja remover o livro "${deleteTarget.titulo}"?` : ''}
        confirmLabel="Remover Permanente"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
