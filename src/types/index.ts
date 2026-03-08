export interface Professor {
  id: string;
  nome: string;
  email: string;
  escolaId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Escola {
  id: string;
  nome: string;
  endereco: string;
  tipo: 'municipal' | 'estadual' | 'federal';
  createdAt: Date;
}

export interface AnoLetivo {
  id: string;
  escolaId: string;
  ano: number;
  bimestres: Bimestre[];
  inicio: Date;
  fim: Date;
  createdAt: Date;
}

export interface Bimestre {
  nome: string;
  numero: number;
  inicio: Date;
  fim: Date;
}

export interface EventoCalendario {
  id: string;
  anoLetivoId: string;
  titulo: string;
  tipo: 'feriado' | 'recesso' | 'prova' | 'conselho' | 'reuniao' | 'projeto' | 'aulareposicao' | 'fechamento';
  data: Date;
  abrangencia: 'nacional' | 'estadual' | 'municipal' | 'escola';
  descricao?: string;
  createdAt: Date;
}

export interface Turma {
  id: string;
  escolaId: string;
  nome: string;
  serie: string;
  turno: 'matutino' | 'vespertino' | 'noturno';
  alunos: Aluno[];
  createdAt: Date;
}

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  avatar?: string;
  turmaId: string;
  frequenciaGeral: number;
  desempenhoGeral: number;
  status: 'ativo' | 'atencao' | 'critico';
  observacoes?: string;
}

export interface Disciplina {
  id: string;
  escolaId: string;
  nome: string;
  componente: string;
  createdAt: Date;
}

export interface PlanoCurso {
  id: string;
  professorId: string;
  escolaId: string;
  anoLetivoId: string;
  turmaId: string;
  disciplinaId: string;
  titulo: string;
  objetivosGerais: string[];
  competencias: string[];
  habilidadesBNCC: string[];
  conteudos: Conteudo[];
  criteriosAvaliacao: string;
  metodologia: string;
  recursos: string[];
  unidades: Unidade[];
  status: 'rascunho' | 'ativo' | 'arquivado';
  createdAt: Date;
  updatedAt: Date;
}

export interface Conteudo {
  id: string;
  descricao: string;
  bimestre: number;
}

export interface Unidade {
  numero: number;
  titulo: string;
  bimestre: number;
  objetivos: string[];
  conteudos: string[];
}

export interface PlanoAula {
  id: string;
  professorId: string;
  planoCursoId: string;
  turmaId: string;
  disciplinaId: string;
  data: Date;
  periodo: number;
  tema: string;
  objetivo: string;
  habilidadeBNCC?: string;
  conteudo: string;
  metodologia: string;
  material: string;
  paginasLivro?: string;
  atividade: string;
  tarefa: string;
  avaliacao: string;
  observacoes: string;
  status: 'rascunho' | 'planejado' | 'executado';
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistroDiario {
  id: string;
  professorId: string;
  turmaId: string;
  disciplinaId: string;
  data: Date;
  conteudoMinistrado: string;
  atividadeAplicada: string;
  presenca: PresencaAluno[];
  observacoes: string;
  pendencias: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PresencaAluno {
  alunoId: string;
  presente: boolean;
  faltaJustificada?: boolean;
}

export interface Avaliacao {
  id: string;
  turmaId: string;
  disciplinaId: string;
  planoAulaId?: string;
  tipo: 'prova' | 'trabalho' | 'atividade' | 'participacao' | 'autoavaliacao';
  descricao: string;
  data: Date;
  peso: number;
  notaMaxima: number;
  notas: NotaAluno[];
  createdAt: Date;
}

export interface NotaAluno {
  alunoId: string;
  nota: number;
  observacoes?: string;
}

export interface TemplateRelatorio {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'plano-curso' | 'plano-aula' | 'diario' | 'relatorio-turma' | 'parecer' | 'ata' | 'atividades' | 'calendario';
  content: string;
  createdAt: Date;
}

export interface ProjetoPedagogico {
  id: string;
  professorId: string;
  escolaId: string;
  titulo: string;
  tema: string;
  periodoInicio: Date;
  periodoFim: Date;
  turmasEnvolvidas: string[];
  objetivos: string[];
  areasIntegradas: string[];
  etapas: EtapaProjeto[];
  produtosFinais: string[];
  rubricas: Rubrica[];
  registros: RegistroProjeto[];
  status: 'planejado' | 'em-andamento' | 'concluido';
  createdAt: Date;
  updatedAt: Date;
}

export interface EtapaProjeto {
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  responsaveis: string[];
}

export interface Rubrica {
  criterio: string;
  nivel1: string;
  nivel2: string;
  nivel3: string;
  nivel4: string;
}

export interface RegistroProjeto {
  data: Date;
  descricao: string;
  evidencias: string[];
  autor: string;
}
export interface Notification {
  id: string;
  type: 'pendency' | 'deadline' | 'update' | 'inconsistency' | 'suggestion' | 'reminder';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  link?: string;
  category?: string;
}

export interface Textbook {
  id: string;
  title: string;
  collection: string;
  subject: string;
  grade: string;
  publisher: string;
  totalChapters: number;
  currentChapter: number;
  progress: number;
  statusByChapter: {
    chapter: number;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    lessonPlanId?: string;
  }[];
}

export interface Inconsistencia {
  id: string;
  modulo: string;
  descricao: string;
  gravidade: 'leve' | 'moderada' | 'critica';
  link: string;
}

export interface Recomendacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'atraso' | 'sugestao' | 'alerta' | 'oportunidade';
  prioridade: 'baixa' | 'media' | 'alta';
  actionLabel: string;
  actionHref: string;
}

export interface Exportacao {
  id: string;
  arquivo: string;
  tipo: 'pdf' | 'excel' | 'csv';
  data: string;
  tamanho: string;
  status: 'disponivel' | 'expirado';
}
