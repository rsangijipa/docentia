'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Exportacoes'
      subtitle='Saida de dados'
      description='Exportacoes em PDF e planilhas serao liberadas com trilha de auditoria e filtros reais. Por enquanto o modulo esta em modo seguro, sem gerar arquivos cenograficos.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
