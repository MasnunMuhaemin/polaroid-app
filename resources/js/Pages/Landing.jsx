import { Head } from '@inertiajs/react';
import Navbar from '@/Sections/Navbar';
import Hero from '@/Sections/Hero';
import HowItWorks from '@/Sections/HowItWorks';
import Sizes from '@/Sections/Sizes';
import Benefits from '@/Sections/Benefits';
import Testimonials from '@/Sections/Testimonials';
import Footer from '@/Sections/Footer';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#FDF8F3] text-[#333333] font-sans selection:bg-[#E57373]/30">
            <Head>
                <title>Cetak Polaroid Online - Kualitas Terbaik</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Dancing+Script:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <Navbar />
            <Hero />
            <HowItWorks />
            <Sizes />
            <Benefits />
            <Testimonials />
            <Footer />

            <style>{`
                .font-outfit { font-family: 'Outfit', sans-serif; }
                .font-dancing { font-family: 'Dancing Script', cursive; }
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
}
