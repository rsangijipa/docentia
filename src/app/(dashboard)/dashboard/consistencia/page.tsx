'use client';

import * as React from 'react';
import { LayoutDashboard, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw, Loader2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { ConsistenciaServiceFB } from '@/services/firebase/domain-services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ConsistenciaPage() {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['consistencia', user?.id],
    queryFn: () => ConsistenciaServiceFB.getAudit(user!.id),
    enabled: !!user?.id
  });

  const handleExportPDF = async () => {
    if (!data) return;

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([600, 800]);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const drawHeader = () => {
        page.drawRectangle({
          x: 0,
          y: 720,
          width: 600,
          height: 80,
          color: rgb(0.06, 0.09, 0.16),
        });
        page.drawText('DOCENTIA - RELATORIO DE CONSISTENCIA', {
          x: 50,
          y: 755,
          size: 16,
          font: fontBold,
          color: rgb(1, 1, 1),
        });
        page.drawText(`Professor ID: ${user?.id?.slice(0, 8)} | Gerado em: ${new Date().toLocaleDateString()}`, {
          x: 50,
          y: 735,
          size: 8,
          font: fontRegular,
          color: rgb(0.8, 0.8, 0.8),
        });
      };

      drawHeader();

      page.drawText('SCORE GLOBAL DE CONSISTENCIA:', { x: 50, y: 680, size: 10, font: fontBold });
      page.drawText(`${data.overallScore}%`, { x: 50, y: 645, size: 32, font: fontBold, color: rgb(0.3, 0.3, 0.9) });

      page.drawText('REGRAS AUDITADAS:', { x: 50, y: 600, size: 10, font: fontBold });

      let y = 570;
      data.rules.forEach((rule: any) => {
        page.drawRectangle({
          x: 50,
          y: y - 45,
          width: 500,
          height: 55,
          borderColor: rgb(0.9, 0.9, 0.9),
          borderWidth: 1,
        });

        page.drawText(rule.title.toUpperCase(), { x: 65, y: y - 15, size: 9, font: fontBold });
        const desc = rule.description.length > 80 ? rule.description.slice(0, 77) + '...' : rule.description;
        page.drawText(desc, { x: 65, y: y - 30, size: 7, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

        page.drawText(`${rule.score}%`, { x: 510, y: y - 20, size: 12, font: fontBold });

        y -= 65;
      });

      page.drawText('Este documento e um espelho da consistencia pedagogica digital.', {
        x: 50,
        y: 50,
        size: 7,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6)
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consistencia-Docentia.pdf`;
      link.click();
      toast.success('Relatório PDF gerado!');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao exportar PDF');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Auditando sua consistência pedagógica...</p>
      </div>
    );
  }

  const score = data?.overallScore ?? 0;

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header com Score */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            <LayoutDashboard className="w-4 h-4" />
            Inteligência e Apoio
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black italic tracking-tight text-slate-900 leading-tight">
            Consistência Pedagógica
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl font-medium leading-relaxed italic">
            Monitoramento em tempo real da aderencia do seu planejamento a BNCC e as diretrizes da rede.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <Card className="rounded-[2.5rem] bg-slate-900 text-white shadow-2xl p-8 min-w-[300px] border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Índice Global</span>
                <Badge className={cn(
                  "h-6 rounded-lg font-black text-[9px] uppercase tracking-tighter border-none",
                  score > 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                )}>
                  {score > 80 ? 'Excelente' : 'Atenção'}
                </Badge>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-6xl font-serif font-black italic text-white leading-none">{score}%</span>
                <TrendingUp className="w-6 h-6 text-emerald-400 mb-1" />
              </div>
              <Progress value={score} className="h-2 rounded-full bg-white/10" />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Regras e Alertas */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-black italic text-slate-900">Regras de Auditoria</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={cn("w-3 h-3", isRefetching && "animate-spin")} />
              Recalcular
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data?.rules.map((rule: any) => (
              <Card key={rule.id} className="rounded-[2rem] group hover:border-primary/30 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      rule.status === 'passed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {rule.status === 'passed' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">{rule.title}</h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{rule.score}% OK</span>
                      </div>
                      <p className="text-sm text-slate-500">{rule.description}</p>

                      {rule.status !== 'passed' && (
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 border-amber-200 bg-amber-50/30 text-amber-700 hover:bg-amber-50">
                            <Sparkles className="w-3 h-3" /> Sugestão da IA Maestro
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Informativa */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-serif font-black italic">Como funciona?</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                A IA do Docentia cruza os dados do seu dia a dia com os requisitos pedagógicos oficiais.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black">01</span>
                  </div>
                  <p className="text-sm text-slate-300"><b>BNCC:</b> Verificação automática de códigos e competências.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black">02</span>
                  </div>
                  <p className="text-sm text-slate-300"><b>Métricas:</b> Cálculo de carga horária e pesos avaliativos.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black">03</span>
                  </div>
                  <p className="text-sm text-slate-300"><b>Alertas:</b> Notificações proativas sobre lacunas no registro.</p>
                </div>
              </div>

              <Button
                onClick={handleExportPDF}
                className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest"
              >
                Baixar Relatório PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200/60 bg-white p-6">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Dica Maestro
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mantenha o alinhamento BNCC acima de 90% para garantir que seus relatórios trimestrais sejam gerados automaticamente sem pendências.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
