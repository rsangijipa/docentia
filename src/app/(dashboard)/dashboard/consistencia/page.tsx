'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Consistencia Pedagogica'
      subtitle='Regras de consistencia'
      description='As regras inteligentes de consistencia ainda estao sendo convertidas para logica verificavel. Nesta fase, o modulo exibe apenas status de roadmap para evitar falsos positivos.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
