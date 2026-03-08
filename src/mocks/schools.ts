import { Escola } from '@/types';

export const mockSchools: Escola[] = [
    {
        id: 'esc-1',
        nome: 'Escola Municipal Monteiro Lobato',
        endereco: 'Rua das Flores, 123 - Centro',
        tipo: 'municipal',
        logo: 'EM',
        color: 'indigo',
        createdAt: new Date('2020-01-01'),
    },
    {
        id: 'esc-2',
        nome: 'Colégio Estadual Tiradentes',
        endereco: 'Av. Brasil, 456 - Vila Nova',
        tipo: 'estadual',
        logo: 'CE',
        color: 'emerald',
        createdAt: new Date('2018-05-15'),
    }
];
