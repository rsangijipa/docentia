'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Templates'
      subtitle='Biblioteca de modelos'
      description='A biblioteca de templates sera conectada ao contexto real de escola e turma. Ate la, removemos a interacao cenografica para manter transparencia no piloto.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
