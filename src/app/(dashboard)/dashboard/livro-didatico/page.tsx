'use client';

import { LayoutDashboard } from 'lucide-react';
import { ModuleComingSoon } from '@/components/dashboard/ModuleComingSoon';

export default function Page() {
  return (
    <ModuleComingSoon
      title='Livro Didatico'
      subtitle='Acompanhamento de material'
      description='O rastreio de uso de livro didatico por aluno e turma sera ligado aos registros reais de aula. O modulo permanece em breve para preservar coerencia operacional.'
      icon={LayoutDashboard}
      eta='Proximas sprints do piloto'
      backTo='/dashboard'
    />
  );
}
