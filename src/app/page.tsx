import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 selection:bg-blue-600 selection:text-white">
            <LandingNavbar />
            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
                <LandingPricing />
            </main>
            <LandingFooter />
        </div>
    );
}
