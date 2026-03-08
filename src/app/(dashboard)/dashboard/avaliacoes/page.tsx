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
        <DialogContent className='sm:max-w-[450px] rounded-2xl'>
          <DialogHeader>
            <DialogTitle>{activeEval ? 'Editar Avaliação' : 'Nova Avaliação'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-1.5'>
              <Label>Título (ex: Prova Bimestral)</Label>
              <Input value={evalForm.title} onChange={e => setEvalForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className='grid gap-1.5'>
              <Label>Turma Associada</Label>
              <select className='h-10 rounded-md border border-input bg-background px-3 text-sm' value={evalForm.turmaId} onChange={e => setEvalForm(p => ({ ...p, turmaId: e.target.value }))}>
                <option value=''>Selecione uma turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className='grid gap-1.5'>
              <Label>Data de Aplicação</Label>
              <Input type='date' value={evalForm.date} onChange={e => setEvalForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-1.5'>
                <Label>Nota Máxima</Label>
                <Input type='number' min='1' value={evalForm.maxGrade} onChange={e => setEvalForm(p => ({ ...p, maxGrade: Number(e.target.value) }))} />
              </div>
              <div className='grid gap-1.5'>
                <Label>Peso na Média</Label>
                <Input type='number' step='0.1' min='0' value={evalForm.weight} onChange={e => setEvalForm(p => ({ ...p, weight: Number(e.target.value) }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setOpenEval(false)}>Cancelar</Button>
            <Button onClick={handleCreateEval} disabled={createEvalMutation.isPending || updateEvalMutation.isPending}>{(createEvalMutation.isPending || updateEvalMutation.isPending) ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Inputting Grades */}
      <Dialog open={openGrade} onOpenChange={setOpenGrade}>
        <DialogContent className='sm:max-w-[600px] h-[80vh] flex flex-col rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Lançamento de Notas</DialogTitle>
            <DialogDescription>Avaliação: {activeEval?.title} (Máx: {activeEval?.maxGrade})</DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto pr-2 space-y-4 py-2 mt-4'>
            {isSubmittingGrades && students.length === 0 ? (
              <div className='flex justify-center p-8'><Loader2 className='w-6 h-6 animate-spin' /></div>
            ) : students.length === 0 ? (
              <div className='text-center text-slate-500 py-8 bg-slate-50 rounded-lg'>Nenhum aluno matriculado nesta turma.</div>
            ) : (
              students.map(student => (
                <div key={student.id} className='flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors'>
                  <span className='font-medium text-sm text-slate-800'>{student.nome}</span>
                  <div className='flex items-center gap-2'>
                    <Label className='text-xs text-slate-400'>Nota:</Label>
                    <Input
                      type='number'
                      step='0.1'
                      min='0'
                      max={activeEval?.maxGrade}
                      className='w-24 h-8 text-right bg-white'
                      value={evaluationResults[student.id] ?? ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className='pt-4 border-t mt-auto'>
            <Button variant='outline' onClick={() => setOpenGrade(false)}>Fechar</Button>
            <Button onClick={handleSaveGrades} disabled={saveGradesMutation.isPending || students.length === 0}>
              {saveGradesMutation.isPending ? 'Salvando...' : 'Gravar Notas'}
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
