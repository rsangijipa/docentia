'use client';

import * as React from 'react';
import {
  FileText,
  Download,
  Table,
  FileSpreadsheet,
  History,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Loader2,
  Calendar,
  Users,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  diaryEntryService,
  evaluationService,
  lessonPlanService,
  classroomService
} from '@/services/supabase/domain-services';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import ExcelJS from 'exceljs';

export default function ExportPage() {
  const { user } = useAuth();
  const [exporting, setExporting] = React.useState<string | null>(null);

  const { data: diaryEntries = [] } = useQuery({
    queryKey: ['diary-entries', user?.id],
    queryFn: () => user?.id ? diaryEntryService.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: evaluations = [] } = useQuery({
    queryKey: ['evaluations', user?.id],
    queryFn: () => user?.id ? evaluationService.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const { data: lessonPlans = [] } = useQuery({
    queryKey: ['lesson-plans', user?.id],
    queryFn: () => user?.id ? lessonPlanService.getByTeacher(user.id) : [],
    enabled: !!user?.id
  });

  const exportToExcel = async (type: 'diarios' | 'avaliacoes' | 'planos') => {
    setExporting(type);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(type.toUpperCase());

      let dataToExport: any[] = [];
      let columns: any[] = [];

      if (type === 'diarios') {
        dataToExport = diaryEntries;
        columns = [
          { header: 'Data', key: 'date', width: 20 },
          { header: 'Título', key: 'title', width: 30 },
          { header: 'Conteúdo', key: 'content', width: 50 },
          { header: 'Turma', key: 'classroomId', width: 20 },
        ];
      } else if (type === 'avaliacoes') {
        dataToExport = evaluations;
        columns = [
          { header: 'Data', key: 'dueDate', width: 20 },
          { header: 'Título', key: 'title', width: 30 },
          { header: 'Peso', key: 'weight', width: 10 },
          { header: 'Turma', key: 'classroomId', width: 20 },
        ];
      } else if (type === 'planos') {
        dataToExport = lessonPlans;
        columns = [
          { header: 'Data', key: 'date', width: 20 },
          { header: 'Título', key: 'title', width: 30 },
          { header: 'Objetivo', key: 'objective', width: 40 },
          { header: 'Turma', key: 'classroomId', width: 20 },
        ];
      }

      sheet.columns = columns;
      sheet.addRows(dataToExport);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `docentia_export_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Exportação de ${type} concluída!`);
    } catch (error) {
      console.error(error);
      toast.error('Erro na exportação.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-16 rounded-[4.5rem] border border-slate-200 text-slate-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -ml-20 -mb-20" />

        <div className="space-y-6 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Download className="w-4 h-4" />
            Relatórios & Exportações
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter leading-none text-slate-900">Saída de Dados</h1>
          <p className="text-slate-500 max-w-xl text-xl font-medium leading-relaxed italic">
            Documente sua jornada pedagógica com exportações precisas em múltiplos formatos de alta fidelidade.
          </p>
        </div>

        <div className="relative z-10 mt-10 md:mt-0">
          <div className='flex flex-col items-center gap-2 p-8 bg-slate-50 border border-slate-100 rounded-[3rem] shadow-sm'>
            <ShieldCheck className='w-10 h-10 text-emerald-600 mb-2' />
            <span className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Segurança de Dados</span>
            <span className='text-sm font-serif italic font-bold text-slate-900'>Trilha de Auditoria Ativa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            id: 'diarios',
            title: 'Diários de Classe',
            subtitle: 'Planilhas de Execução',
            desc: 'Histórico completo de presenças e anotações pedagógicas.',
            icon: FileSpreadsheet,
            count: diaryEntries.length,
            color: 'indigo'
          },
          {
            id: 'avaliacoes',
            title: 'Avaliações',
            subtitle: 'Relatório de Desempenho',
            desc: 'Mapas de notas e status de avaliações programadas.',
            icon: Table,
            count: evaluations.length,
            color: 'amber'
          },
          {
            id: 'planos',
            title: 'Planos de Aula',
            subtitle: 'Portfólio Didático',
            desc: 'Exportação estruturada de roteiros e objetivos BNCC.',
            icon: FileText,
            count: lessonPlans.length,
            color: 'emerald'
          }
        ].map((item) => (
          <Card key={item.id} className="group border-none bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-2 transition-all duration-500">
            <CardContent className="p-0">
              <div className={cn("p-10 space-y-6 border-b", `border-${item.color}-50`)}>
                <div className={cn(
                  "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 shadow-2xl",
                  `bg-${item.color}-50 text-${item.color}-600`
                )}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Badge className={cn("text-[8px] font-black uppercase tracking-widest border-none px-2 h-4", `bg-${item.color}-50 text-${item.color}-600`)}>
                      {item.subtitle}
                    </Badge>
                    <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[8px] px-2 h-4 uppercase">{item.count} itens</Badge>
                  </div>
                  <h3 className="text-2xl font-serif font-black italic text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium italic leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50/50 group-hover:bg-white transition-colors">
                <Button
                  onClick={() => exportToExcel(item.id as any)}
                  disabled={exporting !== null}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 shadow-lg transition-all active:scale-95",
                    `bg-${item.color}-600 hover:bg-${item.color}-700 text-white shadow-${item.color}-200`
                  )}
                >
                  {exporting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Exportar XLSX
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Curator Section */}
      <Card className="bg-slate-950 border-none text-white rounded-[4rem] p-16 relative overflow-hidden shadow-3xl">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex -space-x-4">
            {[GraduationCap, Users, Calendar].map((Icon, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative" style={{ zIndex: 3 - i }}>
                <Icon className="w-10 h-10 text-primary" />
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className='flex items-center justify-center lg:justify-start gap-2'>
              <Sparkles className='w-5 h-5 text-primary' />
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Docentia AI Curator</h4>
            </div>
            <h3 className="text-4xl font-serif font-black italic text-white tracking-tight">Relatórios de Longo Prazo</h3>
            <p className="text-zinc-400 font-medium leading-relaxed italic text-lg max-w-2xl">
              Ativamos a consolidação automática de dados do primeiro trimestre. Seus novos relatórios executivos estarão prontos para exportação em PDF estruturado ao final desta semana.
            </p>
          </div>
          <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] gap-3">
            <History className="w-5 h-5" /> Ver Histórico
          </Button>
        </div>
      </Card>

      <div className='flex justify-center'>
        <p className='text-slate-400 text-xs font-serif italic'>Docentia Export Service v1.0.4 - Processamento Seguro via PDF-Lib & ExcelJS</p>
      </div>
    </div>
  );
}
