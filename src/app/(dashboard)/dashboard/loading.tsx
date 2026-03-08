'use client';

import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in zoom-in duration-500'>
            <Loader2 className='w-12 h-12 text-primary animate-spin' />
            <p className='text-slate-500 font-medium tracking-tight animate-pulse'>Acessando dados pedagógicos...</p>
        </div>
    );
}
