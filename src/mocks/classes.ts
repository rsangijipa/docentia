import { Turma, Aluno } from '@/types';

export const mockAlunos: Aluno[] = [
    { id: 'al-1', nome: 'Ana Beatriz Silva', matricula: '2024001', turmaId: 'turma-8a', frequenciaGeral: 98, desempenhoGeral: 8.5, status: 'ativo' },
    { id: 'al-2', nome: 'Bruno Oliveira', matricula: '2024002', turmaId: 'turma-8a', frequenciaGeral: 92, desempenhoGeral: 7.2, status: 'ativo' },
    { id: 'al-3', nome: 'Carla Souza', matricula: '2024003', turmaId: 'turma-8a', frequenciaGeral: 75, desempenhoGeral: 4.5, status: 'critico', observacoes: 'Necessita de acompanhamento em matemática.' },
    { id: 'al-4', nome: 'Daniel Ferreira', matricula: '2024004', turmaId: 'turma-8a', frequenciaGeral: 88, desempenhoGeral: 6.8, status: 'atencao' },
    { id: 'al-5', nome: 'Eduarda Santos', matricula: '2024005', turmaId: 'turma-8a', frequenciaGeral: 95, desempenhoGeral: 9.0, status: 'ativo' },
    { id: 'al-6', nome: 'Felipe Mendes', matricula: '2024006', turmaId: 'turma-8a', frequenciaGeral: 91, desempenhoGeral: 7.5, status: 'ativo' },
    { id: 'al-7', nome: 'Giovanna Lima', matricula: '2024007', turmaId: 'turma-8a', frequenciaGeral: 82, desempenhoGeral: 6.2, status: 'atencao' },
    { id: 'al-8', nome: 'Henrique Rocha', matricula: '2024008', turmaId: 'turma-8a', frequenciaGeral: 99, desempenhoGeral: 9.8, status: 'ativo' },
    { id: 'al-9', nome: 'Isabela Costa', matricula: '2024009', turmaId: 'turma-8a', frequenciaGeral: 68, desempenhoGeral: 5.1, status: 'critico' },
    { id: 'al-10', nome: 'João Vitor', matricula: '2024010', turmaId: 'turma-8a', frequenciaGeral: 87, desempenhoGeral: 7.0, status: 'ativo' },
];

export const mockTurmas: Turma[] = [
    { id: 'turma-8a', escolaId: 'esc-1', nome: '8º Ano A', serie: '8º Ano', turno: 'matutino', alunos: mockAlunos, createdAt: new Date('2024-02-01') },
    { id: 'turma-9b', escolaId: 'esc-1', nome: '9º Ano B', serie: '9º Ano', turno: 'matutino', alunos: mockAlunos.slice(0, 5), createdAt: new Date('2024-02-01') },
    { id: 'turma-7c', escolaId: 'esc-2', nome: '7º Ano C', serie: '7º Ano', turno: 'vespertino', alunos: mockAlunos.slice(2, 7), createdAt: new Date('2024-02-01') }
];
