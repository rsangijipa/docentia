import { RegistroDiario, ProjetoPedagogico } from '@/types';

export const mockDiaryEntries: RegistroDiario[] = [
    {
        id: 'rd-1',
        professorId: 'prof-1',
        turmaId: 'turma-8a',
        disciplinaId: 'mat-8',
        data: new Date('2024-03-10'),
        conteudoMinistrado: 'Introdução à Potenciação',
        atividadeAplicada: 'Exercícios 1 a 5 da página 15',
        presenca: [
            { alunoId: 'al-1', presente: true },
            { alunoId: 'al-2', presente: true },
            { alunoId: 'al-3', presente: false },
            { alunoId: 'al-4', presente: true },
        ],
        observacoes: 'A turma participou bem.',
        pendencias: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'rd-2',
        professorId: 'prof-1',
        turmaId: 'turma-8a',
        disciplinaId: 'mat-8',
        data: new Date('2024-03-11'),
        conteudoMinistrado: 'Exercícios de fixação',
        atividadeAplicada: 'Trabalho em dupla',
        presenca: [
            { alunoId: 'al-1', presente: true },
            { alunoId: 'al-2', presente: false, faltaJustificada: true },
            { alunoId: 'al-3', presente: true },
            { alunoId: 'al-4', presente: true },
        ],
        observacoes: 'Dificuldade notada no aluno Bruno.',
        pendencias: ['Corrigir trabalhos'],
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export const mockProjects: ProjetoPedagogico[] = [
    {
        id: 'proj-1',
        professorId: 'prof-1',
        escolaId: 'esc-1',
        titulo: 'Feira de Ciências: Energias Renováveis',
        tema: 'Sustentabilidade',
        periodoInicio: new Date('2024-05-01'),
        periodoFim: new Date('2024-06-15'),
        turmasEnvolvidas: ['turma-8a', 'turma-9b'],
        objetivos: ['Conscientizar sobre energia limpa', 'Apresentar protótipos'],
        areasIntegradas: ['Ciências', 'Geografia', 'Matemática'],
        etapas: [
            {
                titulo: 'Pesquisa Inicial',
                descricao: 'Leitura e coleta de dados',
                dataInicio: new Date('2024-05-01'),
                dataFim: new Date('2024-05-15'),
                responsaveis: ['Alexandre Martins']
            },
            {
                titulo: 'Criação de Protótipos',
                descricao: 'Montagem das maquetes',
                dataInicio: new Date('2024-05-16'),
                dataFim: new Date('2024-06-05'),
                responsaveis: ['Alexandre Martins', 'Alunos']
            }
        ],
        produtosFinais: ['Maquetes', 'Relatório'],
        rubricas: [
            { criterio: 'Originalidade', nivel1: 'Insuficiente', nivel2: 'Regular', nivel3: 'Bom', nivel4: 'Excelente' }
        ],
        registros: [],
        status: 'planejado',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
