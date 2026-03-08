'use client';

import * as React from 'react';
import {
  User,
  Mail,
  BookOpen,
  Shield,
  Camera,
  Save,
  Loader2,
  ArrowLeft,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserServiceFB } from '@/services/firebase/domain-services';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar perfil detalhado do Firestore
  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => user?.email ? UserServiceFB.getByEmail(user.email) : null,
    enabled: !!user?.email
  });

  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    disciplinas: '',
    instituicao: '',
    biografia: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || profile.name || '',
        email: profile.email || '',
        disciplinas: Array.isArray(profile.disciplinas) ? profile.disciplinas.join(', ') : '',
        instituicao: profile.instituicao || profile.schoolName || '',
        biografia: profile.biografia || ''
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: any) => user ? UserServiceFB.updateProfile(user.id, data) : Promise.reject('No user'),
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: () => toast.error('Erro ao atualizar perfil.')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      nome: formData.nome,
      disciplinas: formData.disciplinas.split(',').map((d: string) => d.trim()).filter((d: string) => d),
      instituicao: formData.instituicao,
      biografia: formData.biografia,
      updatedAt: new Date().toISOString()
    };
    mutation.mutate(updatedData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header com Navegação */}
      <div className='flex items-center gap-6'>
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-serif font-black italic text-slate-900 tracking-tight">Meu Perfil</h1>
          <p className='text-zinc-500 font-medium italic text-sm'>Gerencie sua identidade docente no Docentia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar - Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3.5rem] border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden relative group">
            <div className="h-32 bg-violet-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            <CardContent className="pt-0 px-8 pb-10 flex flex-col items-center -mt-16 relative z-10">
              <div className="relative group/avatar">
                <div className="h-32 w-32 rounded-[2.5rem] border-4 border-white bg-slate-100 shadow-2xl overflow-hidden flex items-center justify-center relative">
                  {profile?.photoURL ? (
                    <Image src={profile.photoURL} alt={profile.nome} width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <Button size="icon" className="absolute bottom-0 right-0 h-10 w-10 rounded-xl bg-white text-primary border border-slate-100 shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mt-6 space-y-2">
                <h3 className="text-2xl font-serif font-black italic text-slate-900">{profile?.nome || 'Usuário Docentia'}</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-violet-50 text-violet-600 border-none font-black text-[9px] px-2 h-5 tracking-widest uppercase">Professor</Badge>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-2 h-5 tracking-widest uppercase">Verificado</Badge>
                </div>
              </div>

              <div className="w-full h-px bg-slate-50 my-8" />

              <div className="w-full space-y-5">
                <div className="flex items-center gap-4 group/item">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all shadow-inner">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Docente</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{user?.id || '...'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all shadow-inner">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assinatura</p>
                    <p className="text-xs font-bold text-slate-700">Plano Piloto Technic</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Magic AI Insight */}
          <Card className="bg-slate-950 border-none text-white rounded-[3.5rem] p-10 relative overflow-hidden group">
            <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Curadoria AI</h4>
              </div>
              <p className="text-sm font-medium italic leading-relaxed text-slate-300">
                &quot;Seu perfil completo ajuda na personalização da BNCC e na geração de roteiros mais assertivos.&quot;
              </p>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-primary' />
                <span className='text-[10px] font-black uppercase tracking-widest text-primary'>Completude: 85%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content - Form */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[3.5rem] border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Nome Completo</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Email Institucional</Label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={formData.email}
                      readOnly
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-100/50 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Disciplinas (separadas por vírgula)</Label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      value={formData.disciplinas}
                      onChange={(e) => setFormData({ ...formData, disciplinas: e.target.value })}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="Ex: Português, Literatura"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Instituição de Ensino</Label>
                  <div className="relative group">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      value={formData.instituicao}
                      onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="Sua escola ou faculdade"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Biografia Pedagógica</Label>
                <textarea
                  value={formData.biografia}
                  onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                  rows={4}
                  className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 outline-none resize-none italic leading-relaxed"
                  placeholder="Conte um pouco sobre sua trajetória e metodologia..."
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] gap-3 shadow-2xl shadow-indigo-200 transition-all"
                >
                  {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Card>

          {/* Stats or Achievements Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Anos de Docencta', value: '12+', color: 'indigo' },
              { label: 'Projetos Realizados', value: '48', color: 'amber' },
              { label: 'Alunos Impactados', value: '2.4k', color: 'emerald' }
            ].map((stat, i) => (
              <Card key={i} className="rounded-3xl border-slate-50 bg-white p-8 space-y-2 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className={cn("text-3xl font-serif font-black italic", `text-${stat.color}-600`)}>{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
