'use client';

import * as React from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    FileText,
    MessageSquare,
    Plus,
    ArrowRight,
    Download,
    Mail,
    Phone,
    Activity,
    ShieldAlert,
    Share2,
    CheckCircle,
    Loader2,
    Trash2,
    Pencil
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { StudentServiceFB, ClassroomServiceFB } from '@/services/firebase/domain-services';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AlunosPage() {
    const { user } = useAuth();
    const [alunos, setAlunos] = React.useState<any[]>([]);
    const [turmas, setTurmas] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    // Form State
    const [newStudent, setNewStudent] = React.useState({
        nome: '',
        matricula: '',
        turmaId: '',
        status: 'ativo',
        observacoes: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const [alunosData, turmasData] = await Promise.all([
                StudentServiceFB.getByTeacher(user.id),
                ClassroomServiceFB.getByTeacher(user.id)
            ]);

            setAlunos(alunosData);
            setTurmas(turmasData);
        } catch (err) {
            toast.error("Erro ao sincronizar dados dos alunos.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user?.id) fetchData();
    }, [user?.id]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        if (!newStudent.turmaId) {
            toast.error("Selecione uma turma para o aluno.");
            return;
        }
        setIsSubmitting(true);
        try {
            await StudentServiceFB.create({
                ...newStudent,
                teacherId: user.id,
                frequenciaGeral: 100,
                desempenhoGeral: 0,
                createdAt: new Date().toISOString()
            });
            toast.success(`${newStudent.nome} integrado com sucesso.`);
            setIsCreateOpen(false);
            setNewStudent({ nome: '', matricula: '', turmaId: '', status: 'ativo', observacoes: '' });
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar aluno.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Deseja remover ${nome} do ecossistema? Todos os dados vinculados serão perdidos.`)) return;

        try {
            await StudentServiceFB.delete(id);
            toast.success(`${nome} foi removido com sucesso.`);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao excluir aluno.");
        }
    };

    const filteredAlunos = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.matricula.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Sincronizando corpo discente...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            {/* Header Premium */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                        <Users className="w-4 h-4" />
                        Gestão Pedagógica
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900 tracking-tight leading-none italic">
                        Alunos
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base font-medium max-w-xl italic">
                        Acompanhe o pulso individual de cada estudante com dados integrados e análise de risco.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="h-14 flex-1 sm:flex-none rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest gap-2">
                        <Download className="w-4 h-4 text-slate-300" /> Exportar
                    </Button>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 flex-1 sm:flex-none rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-slate-200 border-none transition-all hover:scale-105 active:scale-95">
                                <Plus className="w-4 h-4" /> Novo Aluno
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                            <form onSubmit={handleCreate}>
                                <div className="p-10 space-y-8">
                                    <DialogHeader>
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg italic font-serif font-black text-xl">A</div>
                                        <DialogTitle className="text-3xl font-serif font-black italic tracking-tight text-slate-900">Matricular Aluno</DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium italic">
                                            Integre um novo estudante ao seu ecossistema pedagógico.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</Label>
                                                <Input
                                                    id="nome"
                                                    placeholder="Nome do Aluno"
                                                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold focus:ring-indigo-500/10"
                                                    value={newStudent.nome}
                                                    onChange={e => setNewStudent({ ...newStudent, nome: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="matricula" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Matrícula / ID</Label>
                                                <Input
                                                    id="matricula"
                                                    placeholder="Ex: 2026001"
                                                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold focus:ring-indigo-500/10"
                                                    value={newStudent.matricula}
                                                    onChange={e => setNewStudent({ ...newStudent, matricula: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="turma" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Turma de Destino</Label>
                                            <select
                                                id="turma"
                                                className="w-full h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                value={newStudent.turmaId}
                                                onChange={e => setNewStudent({ ...newStudent, turmaId: e.target.value })}
                                                required
                                            >
                                                <option value="">Selecione a Turma</option>
                                                {turmas.map(t => (
                                                    <option key={t.id} value={t.id}>{t.nome} - {t.serie}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="obs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Observações Iniciais</Label>
                                            <Input
                                                id="obs"
                                                placeholder="Alguma nota importante?"
                                                className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-medium italic focus:ring-indigo-500/10"
                                                value={newStudent.observacoes}
                                                onChange={e => setNewStudent({ ...newStudent, observacoes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="bg-slate-50 p-6 sm:p-10 mt-0">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl font-bold text-slate-400">Cancelar</Button>
                                    <Button type="submit" disabled={isSubmitting} className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-indigo-200 border-none transition-all hover:scale-105">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Confirmar Matrícula
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        placeholder="Pesquisar por nome ou matrícula..."
                        className="pl-14 h-16 bg-white border-slate-200/60 rounded-[1.5rem] shadow-xl shadow-slate-100/30 text-base font-medium transition-all focus:ring-4 focus:ring-indigo-50/50 outline-none font-serif italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-16 px-6 gap-3 bg-white border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                        <Filter className="w-4 h-4 text-slate-300" /> Filtros
                    </Button>
                </div>
            </div>

            {/* Alunos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAlunos.map((aluno) => {
                    const turmaMatched = turmas.find(t => t.id === aluno.turmaId);
                    const statusColor = aluno.status === 'ativo' ? 'emerald' : aluno.status === 'atencao' ? 'amber' : 'rose';

                    return (
                        <Card key={aluno.id} className="group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden relative border-t-0 shadow-sm">
                            <div className={cn(
                                "absolute top-0 left-0 right-0 h-2",
                                statusColor === 'emerald' ? "bg-emerald-500" : statusColor === 'amber' ? "bg-amber-500" : "bg-rose-500"
                            )} />

                            <CardContent className="p-8 sm:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-5">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-serif font-black text-2xl relative group-hover:scale-110 transition-transform shadow-inner shrink-0 italic">
                                            {aluno.nome.charAt(0)}
                                            <div className={cn(
                                                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm",
                                                statusColor === 'emerald' ? "bg-emerald-500" : statusColor === 'amber' ? "bg-amber-500" : "bg-rose-500"
                                            )} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-serif font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 italic leading-tight">{aluno.nome}</h3>
                                            <Badge variant="outline" className="mt-1 h-5 px-2 rounded-lg border-slate-100 text-slate-400 font-black text-[8px] uppercase tracking-wider">{turmaMatched?.nome ?? aluno.turma?.nome ?? 'Sem Turma'}</Badge>
                                            <p className="text-[10px] font-black text-slate-300 mt-2 uppercase">ID: {aluno.matricula}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:bg-slate-50 rounded-2xl shrink-0">
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 border-slate-200 shadow-2xl">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-4">Comandos</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="p-3 rounded-xl gap-3 text-sm font-bold">
                                                <FileText className="w-4 h-4 text-slate-300" /> Histórico Pleno
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="p-3 rounded-xl gap-3 text-sm font-bold">
                                                <TrendingUp className="w-4 h-4 text-slate-300" /> Curva de Aprendizado
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="p-3 rounded-xl gap-3 text-sm font-bold">
                                                <MessageSquare className="w-4 h-4 text-slate-300" /> Canal de Escuta
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="p-3 rounded-xl gap-3 text-sm font-bold">
                                                <Pencil className="w-4 h-4 text-slate-300" /> Editar Registro
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(aluno.id, aluno.nome)}
                                                className="p-3 rounded-xl text-rose-600 gap-3 text-sm font-black"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remover Aluno
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="p-3 rounded-xl text-rose-600 gap-3 text-sm font-black opacity-50">
                                                <ShieldAlert className="w-4 h-4" /> Reportar Ocorrência
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequência</span>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-black",
                                                aluno.frequenciaGeral >= 90 ? 'text-emerald-500' : 'text-rose-500'
                                            )}>{aluno.frequenciaGeral}%</span>
                                        </div>
                                        <Progress value={aluno.frequenciaGeral} className="h-1.5 bg-slate-200/50" />
                                    </div>
                                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Média Global</span>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-black",
                                                aluno.desempenhoGeral >= 7 ? 'text-emerald-500' : 'text-rose-500'
                                            )}>{aluno.desempenhoGeral}</span>
                                        </div>
                                        <Progress value={aluno.desempenhoGeral * 10} className="h-1.5 bg-slate-200/50" />
                                    </div>
                                </div>

                                {aluno.observacoes && (
                                    <Card className="mb-8 p-5 rounded-2xl bg-amber-50/50 border-amber-100 border-none shadow-none flex gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs text-amber-900/70 italic font-medium leading-relaxed italic">"{aluno.observacoes}"</p>
                                    </Card>
                                )}

                                <div className="flex gap-3 pt-6 border-t border-slate-50">
                                    <Button variant="outline" className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                        Perfil Pleno <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600">
                                        <Mail className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-300 hover:bg-emerald-50 hover:text-emerald-600">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredAlunos.length === 0 && !loading && (
                <div className="py-20 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-serif font-black italic text-slate-400">Nenhum aluno encontrado.</h3>
                    <p className="text-slate-300 font-bold uppercase text-[10px] mt-2 tracking-widest">Matricule novos estudantes para começar a coletar dados.</p>
                </div>
            )}

            {/* Analytics Summary */}
            <Card className="bg-[#0f172a] border-none text-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                <CardContent className="p-10 sm:p-14">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8 items-center">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                                <Users className="w-4 h-4" /> Ecossistema Ativo
                            </div>
                            <h3 className="text-5xl font-serif font-black italic tracking-tight">{alunos.length} <span className="text-xs font-sans font-black text-emerald-400 uppercase ml-2 tracking-tighter">Corpo Discente</span></h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-[10px]">
                                <CheckCircle className="w-4 h-4" /> Saúde Pedagógica
                            </div>
                            <div className="flex items-center gap-4">
                                <h3 className="text-5xl font-serif font-black italic text-white tracking-tight">82%</h3>
                                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {/* In real app these values would be computed */}
                            <div className="flex items-center gap-2 text-rose-400 font-black uppercase tracking-widest text-[10px]">
                                <ShieldAlert className="w-4 h-4" /> Risco de Abandono
                            </div>
                            <div className="flex items-center gap-4">
                                <h3 className="text-5xl font-serif font-black italic text-white tracking-tight">00</h3>
                                <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                    <TrendingDown className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-indigo-950 font-black px-10 h-16 rounded-[1.5rem] gap-3 shadow-xl shadow-indigo-500/20 uppercase text-[10px] tracking-widest border-none transition-all active:scale-95">
                                Relatório Maestro <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
