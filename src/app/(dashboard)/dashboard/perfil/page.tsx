'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Perfil'
      subtitle='Dados da conta'
      description='A edicao completa de perfil e preferencias sera liberada com validacao forte e persistencia definitiva. Nesta etapa o modulo segue em breve para evitar estados parciais.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
