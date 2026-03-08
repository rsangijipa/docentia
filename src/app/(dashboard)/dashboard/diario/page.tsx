'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Search,
  ClipboardList,
  Filter,
  Pencil,
  ChevronRight,
  XCircle,
  MoreVertical,
  Plus,
  Users,
  Copy,
  Save,
  Clock,
  ArrowRight,
  UserCheck,
  UserX,
  AlertCircle,
  Hash,
  Share2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useMockData } from '@/hooks/use-mock-data';
import { cn } from '@/lib/utils';

export default function DiarioTurboPage() {
  const { diaryEntries, turmas } = useMockData();
  const [items, setItems] = React.useState(diaryEntries);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<any>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [massPresence, setMassPresence] = React.useState(true);

  const pendingCount = 2;

  const filtered = items.filter(d =>
    d.conteudoMinistrado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header Premium Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
            <ClipboardList className="w-4 h-4" />
            <span className="text-[10px] tracking-widest uppercase">Escritório do Professor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Diário de Classe
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
            Registro rápido de frequência e conteúdo pedagógico.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-rose-100 bg-rose-50 text-rose-600 font-black text-[10px] uppercase gap-2 flex-1 sm:flex-none justify-center">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {pendingCount} Pendências
          </Badge>
          <Button className="h-12 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 font-bold gap-2 flex-1 sm:flex-none">
            <Plus className="w-4 h-4" /> Novo Registro
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hoje" className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 w-full md:w-auto no-scrollbar overflow-x-auto">
            <TabsTrigger value="hoje" className="px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm">Aulas de Hoje</TabsTrigger>
            <TabsTrigger value="semanal" className="px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-400">Visão Semanal</TabsTrigger>
            <TabsTrigger value="historico" className="px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-400">Mensal</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar por conteúdo..." className="pl-12 h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 shrink-0">
              <Filter className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </div>

        <TabsContent value="hoje" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Class Records List */}
            <div className="lg:col-span-8 space-y-6">
              {diaryEntries.map((entry) => (
                <Card key={entry.id} className="group hover:shadow-2xl transition-all duration-500 border-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                  <div className="flex flex-col sm:flex-row min-h-[160px]">
                    <div className="sm:w-56 bg-slate-50 p-8 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[8px] uppercase px-2 h-4">Ativa</Badge>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Matemática</span>
                        </div>
                        <h3 className="font-serif font-black text-2xl text-slate-800 tracking-tight leading-none italic">8º Ano A</h3>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-4 sm:mt-0">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          07:30 - 08:20
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <p className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-snug">{entry.conteudoMinistrado}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                          "{entry.observacoes}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-black text-slate-700">{entry.presenca.filter(p => p.presente).length}/{entry.presenca.length} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Presentes</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-slate-50 text-slate-400">
                            <Copy className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                          </Button>
                          <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border-slate-200 gap-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm" onClick={() => {
                            setSelected(entry);
                            setFormOpen(true);
                          }}>
                            <Pencil className="w-4 h-4" /> Editar Diário
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Pending Action Card */}
              <Card className="rounded-[2.5rem] border-rose-200 bg-rose-50/20 border-dashed border-2 p-10 text-center flex flex-col items-center justify-center gap-6 group hover:bg-rose-50 transition-colors">
                <div className="w-20 h-20 rounded-[2rem] bg-white text-rose-500 flex items-center justify-center shadow-xl shadow-rose-200/50 group-hover:scale-110 transition-transform">
                  <Clock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-black text-rose-900 tracking-tight">Diário Pendente: 9º Ano B</h3>
                  <p className="text-sm font-medium text-rose-700/70 max-w-sm mx-auto leading-relaxed">A aula das 08:20 já foi encerrada. Registre agora para manter seu KPI pedagógico em dia.</p>
                </div>
                <Button className="h-14 bg-rose-600 hover:bg-rose-700 text-white border-transparent gap-3 shadow-xl shadow-rose-200 font-black px-12 rounded-2xl uppercase tracking-widest text-[10px]">
                  Registrar Chamada <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
            </div>

            {/* Sidebar Stats & Tips */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-widest text-[10px]">
                    <AlertCircle className="w-4 h-4" /> Métricas Operacionais
                  </div>
                  <CardTitle className="text-xl font-serif font-black mt-2">Visão da Semana</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adesão à Grade</p>
                      <span className="text-sm font-bold text-slate-800">94.2%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[94%]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-1 p-6 rounded-3xl bg-slate-50 border border-slate-100/50 text-center">
                      <Hash className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aulas</p>
                      <p className="text-2xl font-serif font-black text-slate-800">14/18</p>
                    </div>
                    <div className="space-y-1 p-6 rounded-3xl bg-amber-50 border border-amber-100/50 text-center">
                      <AlertCircle className="w-5 h-5 text-amber-300 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Faltas J.</p>
                      <p className="text-2xl font-serif font-black text-amber-600">03</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 border border-dashed border-primary/20">
                    Exportar Relatório Semanal <Share2 className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-emerald-100 bg-emerald-50/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-20 h-20 text-emerald-900" />
                </div>
                <CardContent className="p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-black text-lg text-emerald-900 leading-tight">Sugestão da IA:<br />Presença em Massa</h3>
                  </div>
                  <p className="text-sm font-medium text-emerald-800/70 leading-relaxed">
                    Você registrou o conteúdo. Deseja aplicar "Presença Total" para os alunos do 8º Ano A agora?
                  </p>
                  <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-emerald-100 gap-3 border-none">
                    <CheckCircle2 className="w-4 h-4" /> Aplicar Turbo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Chamada / Edição */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl h-[90vh] md:h-[700px]">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Column - Attendance (Scrollable) */}
            <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-slate-100 flex flex-col h-[350px] md:h-full bg-slate-50/50">
              <div className="p-8 border-b border-slate-100 bg-white flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-black text-xl flex items-center gap-3 text-slate-800">
                    <UserCheck className="w-6 h-6 text-emerald-500" /> Chamada
                  </h3>
                  <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] px-2 uppercase">8º Ano A</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5 h-10 bg-slate-100 p-1 rounded-xl w-full">
                    <button className="flex-1 rounded-lg bg-white shadow-sm text-[9px] font-black uppercase tracking-tighter text-slate-800">Manual</button>
                    <button className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-tighter text-slate-400 hover:text-slate-600">Presença Total</button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                {turmas[0].alunos.map((aluno, i) => (
                  <div key={aluno.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-800 truncate block">{aluno.nome}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">{aluno.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                        i % 8 === 0 ? "bg-slate-50 text-slate-300" : "bg-emerald-500 text-white shadow-emerald-100"
                      )}>
                        <Check className="w-6 h-6" strokeWidth={3} />
                      </button>
                      <button className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 shadow-sm",
                        i % 8 === 0 && "bg-rose-500 text-white shadow-rose-100"
                      )}>
                        <UserX className="w-6 h-6" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-8 border-b border-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-indigo-500">
                      <Pencil className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Relato Técnico</span>
                    </div>
                    <h2 className="font-serif font-black text-3xl text-slate-900 italic tracking-tight">Conteúdo e Notas</h2>
                  </div>
                  <Button variant="outline" className="h-10 px-4 rounded-xl gap-2 border-indigo-100 text-indigo-600 bg-indigo-50 font-bold text-[10px] uppercase">
                    <Copy className="w-3.5 h-3.5" /> Importar do Planejamento
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Conteúdo Ministrado em Aula</Label>
                  <textarea
                    className="w-full h-40 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 text-base font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:outline-none resize-none transition-all placeholder:text-slate-300 no-scrollbar"
                    placeholder="Quais conceitos foram abordados? Houve alguma dinâmica extra?"
                    defaultValue={selected?.conteudoMinistrado}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Observações Operacionais / Disciplina</Label>
                  <textarea
                    className="w-full h-40 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 text-base font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:outline-none resize-none transition-all placeholder:text-slate-300 no-scrollbar"
                    placeholder="Feedback sobre a turma, ocorrências ou destaques..."
                    defaultValue={selected?.observacoes}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Metadados de Aula</Label>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-3 px-6 h-12 rounded-2xl border border-slate-200 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all group shadow-sm">
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary" /> Atividade para Casa
                    </button>
                    <button className="flex items-center gap-3 px-6 h-12 rounded-2xl border border-slate-200 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all group shadow-sm">
                      <Share2 className="w-4 h-4 text-slate-300 group-hover:text-primary" /> Anexar Fotos
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row justify-end gap-3">
                <Button variant="ghost" onClick={() => setFormOpen(false)} className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 px-8">Sair sem salvar</Button>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-3 font-black px-12 h-14 rounded-2xl shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]" onClick={() => {
                  toast.success('Diário e Chamada consolidados com sucesso!');
                  setFormOpen(false);
                }}>
                  <Save className="w-4 h-4" /> Finalizar Registro
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 14 3 12.3 9.42 20 9.29 10 21l1.7-6.42H4Z" />
    </svg>
  )
}
