'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Notificacoes'
      subtitle='Comunicacao operacional'
      description='A central de notificacoes esta em transicao para eventos reais do sistema. A tela foi simplificada para evitar alertas simulados durante o piloto tecnico.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
