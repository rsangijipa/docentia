'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='BNCC Explorer'
      subtitle='Curadoria pedagogica'
      description='A integracao completa da BNCC com planos, aulas e diario esta em implementacao. Esta tela foi mantida em modo transparente para nao simular recursos ainda nao validados.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
