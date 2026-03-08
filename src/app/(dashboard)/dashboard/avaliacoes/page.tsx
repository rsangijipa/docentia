'use client';

import * as React from 'react';
import { FileEdit, Loader2, Plus, Trash2, GraduationCap, Edit3, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { ClassroomServiceFB, EvaluationServiceFB, StudentServiceFB, EvaluationResultServiceFB } from '@/services/firebase/domain-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmActionDialog } from '@/components/dashboard/ConfirmActionDialog';

type SelectClassroom = {
  id: string;
  nome: string;
}

export default function AvaliacoesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [students, setStudents] = React.useState<any[]>([]);
  const [evaluationResults, setEvaluationResults] = React.useState<Record<string, number>>({});

  const [openEval, setOpenEval] = React.useState(false);
  const [openGrade, setOpenGrade] = React.useState(false);

  const [evalForm, setEvalForm] = React.useState({ title: '', turmaId: '', date: '', weight: 1, maxGrade: 10 });
  const [activeEval, setActiveEval] = React.useState<any | null>(null);

  const [deletingEval, setDeletingEval] = React.useState<any | null>(null);
  const [isSubmittingGrades, setIsSubmittingGrades] = React.useState(false);

  const { data: turmas = [], isLoading: loadingTurmas } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => user?.id ? ClassroomServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: evaluations = [], isLoading: loadingEvals } = useQuery({
    queryKey: ['evaluations', user?.id],
    queryFn: () => user?.id ? EvaluationServiceFB.getByTeacher(user.id) : [],
    enabled: !!user?.id,
  });

  const loading = loadingTurmas || loadingEvals;

  const createEvalMutation = useMutation({
    mutationFn: (payload: any) => EvaluationServiceFB.create(payload),
    onSuccess: () => {
      toast.success('Avaliação criada.');
      queryClient.invalidateQueries({ queryKey: ['evaluations', user?.id] });
      setOpenEval(false);
    },
    onError: () => toast.error('Erro ao criar avaliação.')
  });

  const updateEvalMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => EvaluationServiceFB.update(id, payload),
    onSuccess: () => {
      toast.success('Avaliação atualizada.');
      queryClient.invalidateQueries({ queryKey: ['evaluations', user?.id] });
      setOpenEval(false);
    },
    onError: () => toast.error('Erro ao atualizar avaliação.')
  });

  const deleteEvalMutation = useMutation({
    mutationFn: (id: string) => EvaluationServiceFB.delete(id),
    onSuccess: () => {
      toast.success('Avaliação excluída.');
      queryClient.invalidateQueries({ queryKey: ['evaluations', user?.id] });
      setDeletingEval(null);
    },
    onError: () => toast.error('Erro ao excluir avaliação.')
  });

  const saveGradesMutation = useMutation({
    mutationFn: async (ops: Promise<any>[]) => Promise.all(ops),
    onSuccess: () => {
      toast.success('Notas salvas com sucesso!');
      setOpenGrade(false);
    },
    onError: () => toast.error('Erro ao salvar as notas.')
  });

  const handleCreateEval = () => {
    if (!evalForm.title || !evalForm.turmaId || !evalForm.date) {
      toast.error('Preencha os dados básicos da avaliação.');
      return;
    }

    if (activeEval) {
      updateEvalMutation.mutate({
        id: activeEval.id,
        payload: {
          title: evalForm.title,
          roomId: evalForm.turmaId,
          date: evalForm.date,
          weight: Number(evalForm.weight),
          maxGrade: Number(evalForm.maxGrade),
        }
      });
    } else {
      createEvalMutation.mutate({
        title: evalForm.title,
        roomId: evalForm.turmaId,
        teacherId: user?.id,
        date: evalForm.date,
        weight: Number(evalForm.weight),
        maxGrade: Number(evalForm.maxGrade),
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleDeleteEval = () => {
    if (!deletingEval?.id) return;
    deleteEvalMutation.mutate(deletingEval.id);
  };

  const openEvaluationGrade = async (ev: any) => {
    setActiveEval(ev);
    setOpenGrade(true);
    setIsSubmittingGrades(true);

    try {
      const [studentsData, resultsData] = await Promise.all([
        StudentServiceFB.getByClass(ev.roomId),
        EvaluationResultServiceFB.getByEvaluation(ev.id)
      ]);

      setStudents(studentsData || []);

      const resultsMap: Record<string, number> = {};
      resultsData.forEach((res: any) => {
        resultsMap[res.studentId] = res.grade;
      });
      setEvaluationResults(resultsMap);
    } catch {
      toast.error('Erro ao carregar dados dos alunos.');
    } finally {
      setIsSubmittingGrades(false);
    }
  };

  const handleSaveGrades = () => {
    const ops = Object.keys(evaluationResults).map(studentId =>
      EvaluationResultServiceFB.saveResult(studentId, activeEval.id, evaluationResults[studentId])
    );
    saveGradesMutation.mutate(ops);
  };

  const handleGradeChange = (studentId: string, value: string) => {
    const grade = parseFloat(value);
    setEvaluationResults(prev => ({
      ...prev,
      [studentId]: isNaN(grade) ? 0 : grade
    }));
  };

  if (loading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center space-y-4 text-slate-500'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <p>Carregando avaliações...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in pb-20'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-serif font-black italic text-slate-900 flex items-center gap-2'>
            <FileEdit className='w-7 h-7 text-indigo-500' /> Avaliações
          </h1>
          <p className='text-muted-foreground mt-1'>Gerencie provas, trabalhos e avaliações de estudantes.</p>
        </div>
        <Button onClick={() => { setActiveEval(null); setEvalForm({ title: '', turmaId: '', date: '', weight: 1, maxGrade: 10 }); setOpenEval(true); }} className='gap-2 w-full sm:w-auto shadow-md'>
          <Plus className='w-4 h-4' /> Nova Avaliação
        </Button>
      </div>

      {evaluations.length === 0 ? (
        <Card className='rounded-2xl border-dashed bg-slate-50/50'>
          <CardContent className='py-20 text-center flex flex-col items-center justify-center text-slate-500 space-y-4'>
            <GraduationCap className='w-12 h-12 text-slate-300' />
            <p>Nenhuma avaliação cadastrada ainda.</p>
            <Button variant='outline' onClick={() => setOpenEval(true)}>Criar primeira avaliação</Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {evaluations.map((ev) => {
            const turma = turmas.find(t => t.id === ev.roomId);
            return (
              <Card key={ev.id} className='rounded-2xl hover:border-indigo-200 transition-colors shadow-sm'>
                <CardContent className='p-6 flex flex-col justify-between h-full'>
                  <div>
                    <h3 className='font-bold text-lg text-slate-800 line-clamp-1'>{ev.title}</h3>
                    <div className='flex gap-2 mt-2'>
                      <Badge variant='outline' className='bg-indigo-50/50 text-indigo-700 border-indigo-200'>{turma?.nome || 'Turma?'}</Badge>
                      <Badge variant='secondary'>{formatDate(ev.date)}</Badge>
                    </div>
                  </div>
                  <div className='flex gap-2 mt-6 justify-end'>
                    <Button variant='default' size='sm' className='gap-1.5' onClick={() => openEvaluationGrade(ev)}>
                      <ClipboardCheck className='w-3.5 h-3.5' /> Lançar Notas
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => {
                      setActiveEval(ev);
                      setEvalForm({ title: ev.title, turmaId: ev.roomId, date: ev.date, weight: ev.weight || 1, maxGrade: ev.maxGrade || 10 });
                      setOpenEval(true);
                    }}>
                      <Edit3 className='w-4 h-4 text-slate-500' />
                    </Button>
                    <Button variant='ghost' size='icon' className='text-rose-500 hover:text-rose-600 hover:bg-rose-50' onClick={() => setDeletingEval(ev)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog for Creating/Editing Evaluation Metadata */}
      <Dialog open={openEval} onOpenChange={setOpenEval}>
        <DialogContent className='sm:max-w-[480px] p-0'>
          <DialogHeader className="bg-slate-50/50">
            <DialogTitle>{activeEval ? 'Editar Avaliação' : 'Nova Avaliação'}</DialogTitle>
            <DialogDescription>Configure os parâmetros de pontuação e data para esta atividade.</DialogDescription>
          </DialogHeader>

          <div className='p-8 sm:p-10 space-y-6'>
            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título da Avaliação</Label>
              <Input
                placeholder="Ex: Prova Mensal de Matemática"
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                value={evalForm.title}
                onChange={e => setEvalForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma Destino</Label>
              <select
                className='w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all'
                value={evalForm.turmaId}
                onChange={e => setEvalForm(p => ({ ...p, turmaId: e.target.value }))}
              >
                <option value=''>Selecione uma turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2.5'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Prevista</Label>
                <Input
                  type='date'
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                  value={evalForm.date}
                  onChange={e => setEvalForm(p => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className='space-y-2.5'>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nota Máxima</Label>
                <Input
                  type='number'
                  min='1'
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                  value={evalForm.maxGrade}
                  onChange={e => setEvalForm(p => ({ ...p, maxGrade: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className='space-y-2.5'>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peso na Média Final</Label>
              <Input
                type='number'
                step='0.1'
                min='0'
                placeholder="Ex: 2.0"
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                value={evalForm.weight}
                onChange={e => setEvalForm(p => ({ ...p, weight: Number(e.target.value) }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setOpenEval(false)} className="rounded-xl h-11 px-6">Cancelar</Button>
            <Button
              onClick={handleCreateEval}
              disabled={createEvalMutation.isPending || updateEvalMutation.isPending}
              className="rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] gap-2"
            >
              {(createEvalMutation.isPending || updateEvalMutation.isPending) ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Salvar Avaliação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openGrade} onOpenChange={setOpenGrade}>
        <DialogContent className='sm:max-w-[640px] h-[85vh] flex flex-col p-0'>
          <DialogHeader className="bg-indigo-950 text-white border-none py-12 px-10">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
              <ClipboardCheck className="w-4 h-4" /> Caderneta de Notas
            </div>
            <DialogTitle className="text-white text-3xl italic">{activeEval?.title}</DialogTitle>
            <DialogDescription className="text-indigo-200/60 font-medium">Turma: {turmas.find(t => t.id === activeEval?.roomId)?.nome} • Peso: {activeEval?.weight}</DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto px-8 sm:px-10 py-8 space-y-3 scrollbar-hide'>
            {isSubmittingGrades && students.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 gap-4'>
                <Loader2 className='w-10 h-10 animate-spin text-primary opacity-20' />
                <p className="text-slate-400 text-sm font-medium italic">Sincronizando lista de alunos...</p>
              </div>
            ) : students.length === 0 ? (
              <div className='text-center text-slate-400 py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200'>
                Nenhum aluno matriculado nesta turma.
              </div>
            ) : (
              students.map(student => (
                <div key={student.id} className='flex items-center justify-between p-4 bg-white hover:shadow-lg hover:shadow-primary/5 rounded-2xl border border-slate-100 transition-all group'>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {student.nome.charAt(0)}
                    </div>
                    <span className='font-bold text-sm text-slate-700'>{student.nome}</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Nota</Label>
                    <div className="relative">
                      <Input
                        type='number'
                        step='0.1'
                        min='0'
                        max={activeEval?.maxGrade}
                        className='w-24 h-10 text-right bg-slate-50 border-transparent focus:bg-white focus:border-primary rounded-xl font-black text-primary transition-all'
                        value={evaluationResults[student.id] ?? ''}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      />
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="bg-white/50 border-t-0 p-10">
            <Button variant='outline' onClick={() => setOpenGrade(false)} className="rounded-xl h-12 px-8">Fechar Painel</Button>
            <Button
              onClick={handleSaveGrades}
              disabled={saveGradesMutation.isPending || students.length === 0}
              className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20"
            >
              {saveGradesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gravar Notas'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deletingEval)}
        onOpenChange={(open) => !open && setDeletingEval(null)}
        title='Excluir Avaliação'
        description={deletingEval ? `Confirmar a exclusão da avaliação '${deletingEval.title}'? Todas as notas associadas a ela ficarão órfãs.` : ''}
        confirmLabel='Sim, Excluir'
        loading={deleteEvalMutation.isPending}
        onConfirm={handleDeleteEval}
      />
    </div>
  );
}
