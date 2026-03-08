'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Avaliacoes'
      subtitle='Avaliacao e desempenho'
      description='O modulo de avaliacoes esta sendo consolidado com regras reais de notas, pesos e historico por turma. Enquanto isso, as operacoes desta tela ficam desativadas para evitar dados inconsistentes.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
