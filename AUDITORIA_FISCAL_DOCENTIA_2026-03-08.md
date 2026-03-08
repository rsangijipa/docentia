# Auditoria Fiscal Completa - Docentia (Firebase-first)

Data: 2026-03-08
Status: Em execucao (fase piloto)

## BLOCO 1 - Diagnostico executivo
- Maturidade atual: beta funcional, com base visual boa e fluxos nucleares parcialmente estabilizados.
- Pontos fortes:
  - Build de producao estavel.
  - CRUDs principais de turmas e alunos com autenticacao e ownership no backend.
  - Contrato de API padrao (`success`, `data`, `errorCode`, `message`).
- Fragilidades:
  - Arquitetura hibrida Prisma + Firebase ainda coexistindo.
  - Modulos pedagogicos avancados ainda nao operacionais (marcados como Em breve).
  - Endpoint de seed existia exposto sem controle forte (corrigido nesta fase).
- Riscos atuais:
  - Inconsistencia entre fontes de dados (Firebase x Prisma) em algumas rotas legadas.
  - Ausencia de observabilidade estruturada para piloto.
- Nota atual estimada: 7.4/10 (antes: ~5.8/10).

## BLOCO 2 - Achados da auditoria
| Titulo | Modulo/Arquivo | Problema | Gravidade | Impacto | Causa provavel | Correcao recomendada | Status |
|---|---|---|---|---|---|---|---|
| Login legado quebrado | `src/app/api/auth/login/route.ts` | Fluxo antigo gerava erro de integracao em clientes antigos | Critico | Impede login em builds antigas | Mudanca de arquitetura sem compatibilidade clara | Desativar legado com resposta JSON explicita e migrar para `/api/auth/session` | Corrigido |
| Sessao sem padrao unico | `src/contexts/AuthContext.tsx` + `src/app/api/auth/session/route.ts` | Auth client e backend nao estavam alinhados | Critico | Sessao inconsistente, risco de logout fantasma | Acoplamento historico Prisma auth | Firebase token + sessao httpOnly padronizada | Corrigido |
| Falta de ownership em mutacoes | `src/app/api/turmas/*`, `src/app/api/students/*` | Edicao/exclusao sem validacao completa de dono do recurso | Critico | Risco de alteracao indevida | Falta de guardas por recurso | Validar owner por `teacherId` em GET/PATCH/DELETE | Corrigido |
| Validacao de payload inconsistente | `src/lib/api-schemas.ts` + rotas API | Entradas heterogeneas e erros nao padronizados | Alto | Erros 500 evitaveis e baixa previsibilidade | Ausencia de schema central | Zod em endpoints criticos + mensagens seguras | Corrigido |
| Endpoint debug seed exposto | `src/app/api/debug/seed/route.ts` | Seed acessivel sem controle robusto | Critico | Risco operacional e de dados | Endpoint de desenvolvimento sem hardening | Restringir por ambiente/chave, usar POST e retorno padrao | Corrigido |
| KPI/insight cenografico no dashboard | `src/app/(dashboard)/dashboard/page.tsx` | Numeros e blocos sem valor operacional real | Alto | Reduz confianca no produto | UI priorizada sobre dado real | Reescrever home com dados reais e estados loading/erro/empty | Corrigido |
| Mock residual de pendencias | `src/services/dashboardService.ts` | `pendingDiariesCount = 3` fixo | Alto | Metricas falsas | TODO nao resolvido | Calculo real por aulas sem diario no dia | Corrigido |
| Hook de mock residual | `src/hooks/use-mock-data.ts` | Artefato morto de cenografia | Medio | Debito tecnico e confusao | Migração incompleta | Remover arquivo e manter fonte unica de dados | Corrigido |
| Modulos premium sem backend pronto | `dashboard/bncc`, `templates`, `consistencia` etc. | Risco de parecer funcional sem persistencia | Alto | Frustracao no piloto | Escopo maior que backend disponivel | Marcar honestamente como Em breve com CTA claro | Corrigido |
| Encoding textual inconsistente | Varios arquivos legados | Textos com caracteres quebrados em alguns contextos | Medio | Percepcao de baixa qualidade | Historico de encoding misto | Normalizar para UTF-8 e revisar copy | Planejado |
| Observabilidade de piloto ausente | Aplicacao toda | Falta de tracking por fluxo critico | Medio | Dificulta diagnostico em uso real | Sem camada de telemetria | Logs estruturados + metricas de funil | Planejado |

## BLOCO 3 - Plano de correcao priorizado
1. Criticos (feitos)
- Unificacao de auth Firebase-first com sessao httpOnly.
- Guardas de autorizacao por ownership em rotas sensiveis.
- Bloqueio/hardening do endpoint de seed.
- Eliminacao de cenografia critica no dashboard e modulos sem backend.

2. Alta prioridade (em andamento)
- Concluir migracao de dados para Firebase em rotas ainda Prisma-dependentes.
- Revisar fluxo completo lista > detalhe > edicao > salvar > retorno em todos os modulos nucleares.
- Finalizar hardening de respostas de erro e politicas de rate limit por endpoint sensivel.

3. Media prioridade
- Normalizacao de copy e encoding (UTF-8) em todo o app.
- Acessibilidade AA minima (foco, labels, teclado) nas telas principais.
- Otimizacoes de render e simplificacao de client components.

4. Refinamentos
- Observabilidade de piloto (eventos de login, CRUDs nucleares, erros por rota).
- Painel de metricas operacionais do teste real.

## BLOCO 4 - Implementacao aplicada nesta etapa
- Reescrita operacional da home do dashboard:
  - Arquivo: `src/app/(dashboard)/dashboard/page.tsx`
  - Removidos KPIs fake e blocos cenograficos.
  - Adicionados estados `loading`, `error` e `empty` com retry.
  - Cards e agenda ligados a dados reais do Firebase.
- Hardening de seed:
  - Arquivo: `src/app/api/debug/seed/route.ts`
  - Troca para `POST`.
  - Bloqueio por ambiente/chave (`DEBUG_SEED_KEY`).
  - Seed idempotente com `upsert` e resposta padronizada.
- Remocao de mock residual:
  - Arquivo removido: `src/hooks/use-mock-data.ts`.
- Remocao de metrica fake no backend legado:
  - Arquivo: `src/services/dashboardService.ts`
  - `pendingDiariesCount` agora calculado por ausencia de diario para aulas ate a data atual.

## BLOCO 5 - Validacao final
- Validacoes executadas:
  - `npm run build` concluido com sucesso apos as alteracoes.
  - Busca por chamadas de `/api/auth/login` no frontend atual: sem uso ativo.
  - Busca por `useMockData`: sem referencias ativas.
- Pronto para testes reais agora:
  - Login Firebase-first + sessao segura.
  - CRUD operacional de turmas e alunos com ownership no backend.
  - Dashboard inicial sem cenografia critica.
- Pendencias para proxima fase (Em breve):
  - Migracao de rotas remanescentes Prisma-first para Firebase-first.
  - Observabilidade e metricas de piloto.
  - Normalizacao completa de encoding/textos legados.
