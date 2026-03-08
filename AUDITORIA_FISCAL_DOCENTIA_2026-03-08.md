# Auditoria Fiscal Completa - Docentia (Firebase-first)

Data: 2026-03-08
Status: Execucao concluida para fase piloto

## BLOCO 1 - Diagnostico executivo
- Maturidade atual: beta confiavel para piloto controlado.
- Pontos fortes:
  - Auth Firebase-first com sessao httpOnly validada no backend.
  - APIs nucleares padronizadas e protegidas por ownership.
  - Fluxos reais de turmas, alunos, planos de aula, planos de curso, diario e calendario.
  - Build de producao validado.
- Fragilidades residuais:
  - Modulos estrategicos ainda em modo Em breve (BNCC avancado, templates inteligentes, relatorios avancados, consistencia IA).
  - Observabilidade ainda basica (logs estruturados sem painel de metricas dedicado).
- Nota atual estimada: 8.2/10.

## BLOCO 2 - Achados da auditoria (status atualizado)
| Titulo | Modulo/Arquivo | Gravidade | Correcao aplicada | Status |
|---|---|---|---|---|
| Auth legado inconsistente | `src/app/api/auth/*` + `src/contexts/AuthContext.tsx` | Critico | Fluxo unificado Firebase token -> `/api/auth/session` -> sessao segura | Corrigido |
| Endpoints CRUD sem ownership robusto | `src/app/api/turmas/*`, `src/app/api/students/*` | Critico | Ownership por `teacherId` em leitura/mutacao | Corrigido |
| Dependencia Prisma em rotas sensiveis | `src/app/api/turmas/*`, `students/*`, `dashboard/stats` | Alto | Migracao para adapter Firebase Admin (`admin-data.ts`) | Corrigido |
| Endpoint debug sem hardening | `src/app/api/debug/seed/route.ts` | Critico | POST + gate por ambiente/chave | Corrigido |
| Endpoint de atalho de login inseguro | `src/app/api/auth/dev-login/route.ts` | Critico | Bloqueio por `NODE_ENV=development` + `DEV_LOGIN_ENABLED=true` | Corrigido |
| Dashboard com dados cenograficos | `src/app/(dashboard)/dashboard/page.tsx` | Alto | Painel ligado a dados reais e estados completos | Corrigido |
| Fluxos com acoes falsas em modulos core | `alunos`, `turmas`, `planos-aula`, `planos-curso`, `calendario`, `diario` | Alto | CRUD real de create/update/delete com feedback e refresh | Corrigido |
| Mock residual no codigo | `src/mocks/*`, `src/hooks/use-mock-data.ts` | Medio | Remocao dos artefatos mortos | Corrigido |
| Falta de rastreabilidade para piloto | APIs criticas | Medio | `x-request-id` + logs estruturados (`request-trace.ts`) | Corrigido |
| Texto/encoding legado inconsistente | telas antigas pontuais | Medio | Normalizacao parcial em fluxos nucleares | Parcial |

## BLOCO 3 - Plano de correcao (apos execucao)
1. Criticos: concluido.
2. Alta prioridade: concluida para fluxos nucleares do piloto.
3. Media prioridade:
- Finalizar normalizacao textual/UX copy em todas as telas nao nucleares.
- Evoluir observabilidade para dashboard de metricas de produto.
4. Refinamentos:
- Implementar modulos Em breve com backend real (BNCC avancado, relatorios inteligentes, templates dinâmicos).

## BLOCO 4 - Implementacao aplicada
- Novos componentes/servicos:
  - `src/services/firebase/admin-data.ts`
  - `src/lib/request-trace.ts`
- APIs migradas/hardening:
  - `src/app/api/turmas/route.ts`
  - `src/app/api/turmas/[id]/route.ts`
  - `src/app/api/students/route.ts`
  - `src/app/api/students/[id]/route.ts`
  - `src/app/api/dashboard/stats/route.ts`
  - `src/app/api/auth/session/route.ts`
  - `src/app/api/auth/dev-login/route.ts`
  - `src/app/api/debug/seed/route.ts`
- Frontend operacional:
  - `src/app/(dashboard)/dashboard/alunos/page.tsx` (consumo por API segura)
  - Fluxos reais confirmados para `turmas`, `planos-aula`, `planos-curso`, `calendario`, `diario`.
- Limpeza de debito tecnico:
  - Remocao de `src/mocks/*`
  - Remocao de servicos Prisma legados nao utilizados
  - Atualizacao de `.env.example` com gates de seguranca

## BLOCO 5 - Validacao final
- Build executado com sucesso: `npm run build`.
- Estado para piloto:
  - Sem erro bloqueante nos fluxos nucleares de professor.
  - Sem acao cenografica nos modulos declarados como operacionais.
  - Rotas sensiveis com autenticacao/sessao/ownership e resposta padronizada.
- Itens que permanecem Em breve (explicitos):
  - BNCC avancado com inferencia pedagogica por regra.
  - Relatorios inteligentes e templates contextuais.
  - Camada de analytics de produto em painel dedicado.
