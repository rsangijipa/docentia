'use client';

import * as React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    React.useEffect(() => {
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in'>
            <div className='p-4 bg-rose-50 rounded-full border border-rose-100'>
                <ShieldAlert className='w-12 h-12 text-rose-500' />
            </div>
            <div className='text-center space-y-2 max-w-md'>
                <h2 className='text-2xl font-serif font-black text-slate-900'>Oops! Algo deu errado.</h2>
                <p className='text-slate-500'>
                    Ocorreu um erro inesperado ao carregar os dados. Nossa equipe técnica já foi notificada.
                </p>
            </div>
            <Button onClick={reset} variant='default' className='gap-2 rounded-xl h-11 px-8 shadow-sm'>
                <RotateCcw className='w-4 h-4' /> Tentar Novamente
            </Button>
        </div>
    );
}
