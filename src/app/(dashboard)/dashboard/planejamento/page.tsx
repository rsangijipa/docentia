'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Planejamento'
      subtitle='Planejamento integrado'
      description='O planejamento integrado entre plano de curso, plano de aula e diario esta sendo consolidado em fluxo unico. Esta tela foi temporariamente convertida para modo em breve.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
