import { Professor } from '@/types';

export const mockUser: Professor = {
    id: 'prof-1',
    nome: 'Alexandre Martins',
    email: 'alexandre.martins@escola.gov.br',
    escolaId: 'esc-1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Coordenador Pedagógico',
    especialidade: 'Matemática e Ciências Exatas',
    formacao: 'Doutorado em Educação Matemática - USP',
    createdAt: new Date('2024-01-01'),
};

export const mockProfessor = mockUser;
