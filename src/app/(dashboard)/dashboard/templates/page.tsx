'use client';

import * as React from 'react';
import {
  Layout,
  Copy,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Loader2,
  ArrowLeft,
  FileText,
  Grid,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
import { templateService } from '@/services/supabase/domain-services';

export default function TemplatesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);

  const [newTemplate, setNewTemplate] = React.useState({
    titulo: '',
    categoria: '',
    tipo: 'plano-de-aula',
    conteudo: '',
    tags: [] as string[]
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', user?.id],
    queryFn: () => user?.id ? templateService.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => templateService.create(data),
    onSuccess: () => {
      toast.success('Template salvo com sucesso!');
      setIsCreateOpen(false);
      setNewTemplate({ titulo: '', categoria: '', tipo: 'plano-de-aula', conteudo: '', tags: [] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templateService.delete(id),
    onSuccess: () => {
      toast.success('Template removido.');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  const duplicateMutation = useMutation({
    mutationFn: (template: any) => {
      const { id, created_at, updated_at, ...data } = template;
      return templateService.create({
        ...data,
        titulo: `${data.titulo} (Cópia)`,
        teacher_id: user?.id,
        created_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast.success('Template duplicado!');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  const filteredTemplates = templates.filter((t: any) =>
    (t.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
        <p className='text-zinc-500 font-medium italic'>Carregando seus modelos autorais...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 bg-white p-16 rounded-[4.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full -ml-20 -mb-20" />

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Layout className="w-4 h-4" />
            Asset Library
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter leading-none text-slate-900">Templates</h1>
          <p className="text-slate-500 max-w-xl text-xl font-medium leading-relaxed italic">
            Sua biblioteca pessoal de modelos otimizados. Reutilize sua inteligência pedagógica com um clique.
          </p>
        </div>

        <div className="relative z-10">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-16 px-10 rounded-2xl bg-indigo-950 text-white hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[11px] gap-3 shadow-2xl transition-all active:scale-95">
                <Plus className="w-5 h-5" /> Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-xl p-0 overflow-hidden border-none shadow-3xl rounded-[3rem]'>
              <DialogHeader className="bg-indigo-950 text-white py-12 px-10 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <DialogTitle className="text-3xl font-serif font-black italic">Criar Modelo</DialogTitle>
                  <DialogDescription className="text-zinc-400 font-medium">Defina uma estrutura reutilizável para sua prática.</DialogDescription>
                </div>
              </DialogHeader>

              <form onSubmit={(e) => { e.preventDefault(); if (user?.id) createMutation.mutate({ 
                titulo: newTemplate.titulo,
                categoria: newTemplate.categoria,
                tipo: newTemplate.tipo,
                conteudo: newTemplate.conteudo,
                tags: newTemplate.tags,
                teacher_id: user.id,
                created_at: new Date().toISOString()
               }); }} className="p-10 space-y-6">
                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Template</Label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      value={newTemplate.titulo}
                      onChange={(e) => setNewTemplate({ ...newTemplate, titulo: e.target.value })}
                      placeholder="Ex: Roteiro Base - Metodologias Ativas"
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoria / Eixo</Label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      value={newTemplate.categoria}
                      onChange={(e) => setNewTemplate({ ...newTemplate, categoria: e.target.value })}
                      placeholder="Ex: Projetos, Diários, Avaliações"
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="pt-6">
                  <Button type='submit' disabled={createMutation.isPending} className="w-full h-16 rounded-2xl bg-indigo-950 text-white font-black uppercase tracking-widest text-[11px] gap-2 shadow-2xl">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                    Salvar na Biblioteca
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
          <button className="px-8 py-3 rounded-xl bg-indigo-950 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Meus Modelos</button>
          <button className="px-8 py-3 rounded-xl text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">Docentia Pro</button>
          <button className="px-8 py-3 rounded-xl text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">Compartilhados</button>
        </div>
        <div className="relative w-full md:w-80 h-14">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar templates..."
            className="pl-12 h-full rounded-2xl border-none shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredTemplates.length > 0 ? filteredTemplates.map((template: any) => (
          <Card key={template.id} className="group border-none bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <CardContent className="p-0">
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 text-indigo-400 flex items-center justify-center transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white shadow-inner group-hover:rotate-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-200 hover:text-rose-500 rounded-xl" onClick={() => setDeleteTarget(template)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Badge className="bg-amber-50 text-amber-600 border-none px-2 h-4 text-[8px] font-black uppercase tracking-widest">{template.categoria}</Badge>
                  <h3 className="text-2xl font-serif font-black italic text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{template.titulo}</h3>
                  <p className="text-sm text-slate-400 font-medium italic leading-relaxed line-clamp-2">Modelo estruturado para otimização de tempo em planejamentos recorrentes.</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 group-hover:bg-white transition-colors border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-600 gap-2 hover:bg-transparent px-0"
                  onClick={() => duplicateMutation.mutate(template)}
                  disabled={duplicateMutation.isPending}
                >
                  <Copy className="w-4 h-4" /> {duplicateMutation.isPending ? 'Duplicando...' : 'Duplicar Modelo'}
                </Button>
                <Button variant="ghost" className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl">
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className='col-span-full py-32 flex flex-col items-center justify-center space-y-6 bg-white rounded-[4rem] border border-dashed border-slate-200 group hover:border-indigo-200 transition-all'>
            <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:rotate-12 transition-all">
              <Grid className="w-12 h-12" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-serif font-black italic text-slate-900">Biblioteca Vazia</h3>
              <p className="text-slate-400 font-medium italic">Seus templates salvos aparecerão aqui para agilizar seu dia.</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Banner */}
      <Card className="bg-slate-950 border-none text-white rounded-[4rem] p-16 relative overflow-hidden shadow-3xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-white/10 backdrop-blur-xl">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Template Auto-Gen</h4>
            <h3 className="text-4xl font-serif font-black italic text-white tracking-tight">Potencialize seus Modelos</h3>
            <p className="text-zinc-400 font-medium leading-relaxed italic text-lg max-w-2xl">
              &quot;Identificamos que você repete a estrutura de &apos;Problematização&apos; em seus planos. Deseja transformar este padrão em um Smart Template?&quot;
            </p>
          </div>
          <Button className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[11px] gap-3 shadow-2x transition-all">
            Criar Smart Template
          </Button>
        </div>
      </Card>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
        title="Arquivar Template"
        description={deleteTarget ? `Tem certeza que deseja remover o template "${deleteTarget.titulo}"?` : ''}
        confirmLabel="Remover Permanente"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
