export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Full-screen hero image only */}
            <img
                src="/images/hero/hero.png"
                alt="Polaroid Hero"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-widest">Scroll</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </section>
    );
}
