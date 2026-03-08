import { Notification, Textbook, TemplateRelatorio, Inconsistencia, Recomendacao, Exportacao } from '@/types';

export const mockNotifications: Notification[] = [
    {
        id: 'not-1',
        type: 'pendency',
        title: 'Diários Pendentes',
        message: 'Você tem 2 diários não finalizados da semana passada.',
        date: new Date(),
        read: false,
        priority: 'high',
        link: '/dashboard/diario'
    },
    {
        id: 'not-2',
        type: 'inconsistency',
        title: 'BNCC não vinculada',
        message: 'O plano de aula de amanhã não possui habilidade BNCC associada.',
        date: new Date(),
        read: false,
        priority: 'medium',
        link: '/dashboard/planos-aula'
    },
    {
        id: 'not-3',
        type: 'deadline',
        title: 'Conselho de Classe',
        message: 'Faltam 5 dias para o conselho de classe do 1º Bimestre.',
        date: new Date(),
        read: false,
        priority: 'high',
        link: '/dashboard/calendario'
    }
];

export const mockTextbooks: Textbook[] = [
    {
        id: 'cb-1',
        title: 'Matemática Realidade e Tecnologia',
        collection: 'PNLD 2024',
        subject: 'Matemática',
        grade: '8º Ano',
        publisher: 'Editora Moderna',
        totalChapters: 12,
        currentChapter: 3,
        progress: 25,
        statusByChapter: [
            { chapter: 1, title: 'Números Reais', status: 'completed' },
            { chapter: 2, title: 'Potenciação', status: 'completed' },
            { chapter: 3, title: 'Radiciação', status: 'in-progress' },
            { chapter: 4, title: 'Expressões Algébricas', status: 'pending' },
        ]
    }
];

export const mockTemplates: TemplateRelatorio[] = [
    {
        id: 'temp-1',
        name: 'Plano de Aula Padrão BNCC',
        description: 'Template otimizado para preenchimento de habilidades e competências.',
        category: 'Relatórios',
        type: 'plano-aula',
        content: '...',
        createdAt: new Date()
    },
    {
        id: 'temp-2',
        name: 'Parecer Descritivo Individual',
        description: 'Modelo para avaliação socioemocional e cognitiva do aluno.',
        category: 'Relatórios',
        type: 'parecer',
        content: '...',
        createdAt: new Date()
    },
    {
        id: 'temp-3',
        name: 'Ata de Resultados Finais',
        description: 'Documento oficial para fechamento de ano letivo.',
        category: 'Atas',
        type: 'ata',
        content: '...',
        createdAt: new Date()
    }
];

export const mockInconsistencias: Inconsistencia[] = [
    { id: 'inc-1', modulo: 'Plano de Aula', descricao: 'Aula de "Frações" sem habilidade BNCC vinculada.', gravidade: 'moderada', link: '/dashboard/planos-aula' },
    { id: 'inc-2', modulo: 'Diário', descricao: 'Frequência do dia 05/03 incompleta (8º Ano A).', gravidade: 'critica', link: '/dashboard/diario' },
    { id: 'inc-3', modulo: 'Livro Didático', descricao: 'O capítulo 4 ainda não foi planejado em nenhuma aula.', gravidade: 'leve', link: '/dashboard/livro-didatico' },
];

export const mockRecomendacoes: Recomendacao[] = [
    {
        id: 'rec-1',
        titulo: 'Consolidação de Diários',
        descricao: '3 diários podem ser fechados hoje com a cópia do plano semanal.',
        tipo: 'sugestao',
        prioridade: 'alta',
        actionLabel: 'Fechar Diários',
        actionHref: '/dashboard/diario'
    },
    {
        id: 'rec-2',
        titulo: 'Defasagem de Conteúdo',
        descricao: 'O 8º Ano B está 2 capítulos atrás do cronograma previsto.',
        tipo: 'atraso',
        prioridade: 'alta',
        actionLabel: 'Ajustar Plano',
        actionHref: '/dashboard/planos-curso'
    },
    {
        id: 'rec-3',
        titulo: 'Nova Habilidade Disponível',
        descricao: 'A BNCC atualizou competências de Cultura Digital para sua série.',
        tipo: 'oportunidade',
        prioridade: 'media',
        actionLabel: 'Explorar BNCC',
        actionHref: '/dashboard/bncc'
    },
];

export const mockExportacoes: Exportacao[] = [
    { id: 'exp-1', arquivo: 'Diario_Consolidado_Março.pdf', tipo: 'pdf', data: '08/03/2026', tamanho: '2.4 MB', status: 'disponivel' },
    { id: 'exp-2', arquivo: 'Notas_1_Bimestre_8A.xlsx', tipo: 'excel', data: '07/03/2026', tamanho: '450 KB', status: 'disponivel' },
];
