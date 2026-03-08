export interface BNCCSkill {
    id: string;
    code: string;
    description: string;
    grade: string;
    subject: string;
}

export const mockBNCC: BNCCSkill[] = [
    {
        id: 'bncc-1',
        code: 'EF09MA01',
        description: 'Resolver e elaborar problemas com números reais, inclusive em notação científica, envolvendo as diversas operações.',
        grade: '9º Ano',
        subject: 'Matemática'
    },
    {
        id: 'bncc-2',
        code: 'EF09MA02',
        description: 'Reconhecer um número irracional como um número real cuja representação decimal é infinita e não periódica, e estimar a localização de alguns deles na reta numérica.',
        grade: '9º Ano',
        subject: 'Matemática'
    },
    {
        id: 'bncc-3',
        code: 'EF08MA01',
        description: 'Efetuamos cálculos com potências de expoentes inteiros e aplicamos esse conhecimento em situações-problemas.',
        grade: '8º Ano',
        subject: 'Matemática'
    },
    {
        id: 'bncc-4',
        code: 'EF08LP01',
        description: 'Identificar e comparar as várias editorias de jornais impressos e digitais e de sites noticiosos.',
        grade: '8º Ano',
        subject: 'Português'
    },
    {
        id: 'bncc-5',
        code: 'EF07CI01',
        description: 'Discutir a aplicação, a eficiência e o custo-benefício de diferentes máquinas térmicas e o impacto social dessas tecnologias.',
        grade: '7º Ano',
        subject: 'Ciências'
    }
];
