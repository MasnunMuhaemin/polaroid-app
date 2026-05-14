export default function Benefits() {
    const benefits = [
        {
            title: "Hasil Cetak Tajam",
            desc: "Detail terlihat jelas dengan warna yang hidup.",
            icon: (
                <svg className="w-6 h-6 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Kertas Berkualitas",
            desc: "Kertas foto premium tebal dan tahan lama.",
            icon: (
                <svg className="w-6 h-6 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Packing Aman",
            desc: "Setiap foto dikemas rapi agar sampai dengan aman.",
            icon: (
                <svg className="w-6 h-6 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            title: "Kepuasan Terjamin",
            desc: "Kami selalu siap membantu hingga kamu puas.",
            icon: (
                <svg className="w-6 h-6 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <section id="benefits" className="py-24 bg-[#FDFBF8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:pr-64">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-center">
                    
                    {/* LEFT: Heading & Description */}
                    <div className="lg:col-span-3 text-center lg:text-left flex flex-col justify-center">
                        <span className="text-xs font-black text-[#E57373] uppercase tracking-[0.3em] mb-4 block">
                            KENAPA PILIH KAMI? ❤️
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black font-outfit leading-tight mb-8">
                            Lebih Dari Sekadar <br />
                            Cetak Foto
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
                            Kami berkomitmen memberikan pengalaman terbaik untuk setiap cetakan fotomu. Detail, presisi, dan kepuasan Anda adalah prioritas kami.
                        </p>
                    </div>

                    {/* MIDDLE: Benefits Grid (2x2) */}
                    <div className="lg:col-span-7 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-[24px] flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="w-14 h-14 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg uppercase tracking-wide mb-2 text-gray-800">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Featured Image (Full Screen Edge Bleed) */}
            <div className="absolute top-0 bottom-0 right-0 w-[18%] xl:w-[22%] hidden lg:block overflow-hidden group">
                <img 
                    src="https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=1200&auto=format&fit=crop" 
                    alt="Our Studio" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
        </section>
    );
}