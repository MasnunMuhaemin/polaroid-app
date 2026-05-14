export default function Testimonials() {
    return (
        <section className="py-24 bg-[#FDF8F3]">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-black font-outfit uppercase tracking-tight mb-16">
                    APA KATA MEREKA? <span className="text-[#E57373]">❤️</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Annisa P.", text: "Hasil cetaknya bagus banget! Warna cerah dan detailnya tajam. Packaging juga rapi dan aman.", stars: 5 },
                        { name: "Dimas W.", text: "Prosesnya mudah and cepat. Pesan hari ini, dua hari kemudian sudah sampai. Puas banget!", stars: 5 },
                        { name: "Rani S.", text: "Cetak foto di sini jadi langganan! Kualitas top, harga bersahabat, recommended!", stars: 5 }
                    ].map((testi, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[40px] shadow-xl border border-white text-left relative group hover:bg-[#E57373] transition-all duration-500">
                            <div className="flex gap-1 mb-6">
                                {[...Array(testi.stars)].map((_, i) => (
                                    <span key={i} className="text-[#E57373] group-hover:text-white transition-colors text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-500 group-hover:text-white/90 transition-colors font-medium mb-8 leading-relaxed italic">"{testi.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-white/20 group-hover:text-white">{testi.name[0]}</div>
                                <h4 className="font-black text-sm uppercase tracking-wider group-hover:text-white">{testi.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
