export default function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-orange-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-[#E57373] rounded-lg flex items-center justify-center text-white font-black text-xl">
                                P
                            </div>
                            <span className="text-xl font-black tracking-tight font-outfit uppercase">Polaroid.App</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">Cetak momen terbaikmu menjadi kenangan sepanjang masa dengan kualitas terbaik dan proses yang mudah.</p>
                        <div className="flex gap-4">
                            {['instagram', 'whatsapp', 'facebook', 'twitter'].map((social) => (
                                <div key={social} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#E57373] hover:bg-[#E57373]/10 transition-all cursor-pointer group">
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100 uppercase text-[8px]">{social.slice(0, 2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-gray-400">Informasi</h4>
                        <ul className="flex flex-col gap-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Cara Order</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Ukuran & Harga</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-gray-400">Bantuan</h4>
                        <ul className="flex flex-col gap-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Pengiriman</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Pembayaran</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Kontak</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-4">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-gray-400">Newsletter</h4>
                        <p className="text-gray-400 text-xs font-medium mb-6">Dapatkan info promo dan tips menarik seputar fotografi.</p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Email kamu" 
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#E57373]/20"
                            />
                            <button className="bg-[#E57373] text-white p-3 rounded-xl hover:bg-[#D32F2F] transition-colors shadow-lg shadow-red-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <ul className="flex flex-col gap-3 text-[11px] font-black text-gray-500 tracking-widest">
                                <li className="flex items-center gap-3"><span>📞</span> 0812-3456-7890</li>
                                <li className="flex items-center gap-3 lowercase"><span>✉️</span> halo@polaroidapp.com</li>
                                <li className="flex items-center gap-3"><span>📍</span> Jakarta, Indonesia</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    <p>© 2024 Polaroid.App. Semua hak dilindungi.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-500 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
