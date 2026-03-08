'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Relatorios'
      subtitle='Analitico pedagogico'
      description='Os relatorios serao publicados com dados reais, filtros por periodo e consistencia com ownership. O modulo fica desativado ate concluir a camada de dados confiavel.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
