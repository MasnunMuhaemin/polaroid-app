export default function Footer() {
    return (
        <footer className="bg-[#FDFBF8] pt-16 pb-8 md:pt-24 md:pb-12">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-24">
                    
                    {/* Brand & Socials */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-4 mb-6">
                            {/* Logo Placeholder (Line Icon style) */}
                            <svg className="w-12 h-12 text-[#E57373]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                                <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2.5"/>
                                <path d="M48 20L52 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M16 16L48 16M16 48L48 48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
                            </svg>
                            <p className="text-gray-600 text-xs font-medium leading-relaxed max-w-[180px]">
                                Cetak momen terbaikmu menjadi kenangan sepanjang masa.
                            </p>
                        </div>
                        
                        <div className="flex gap-4 mt-8">
                            {[
                                { icon: "instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                { icon: "whatsapp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                                { icon: "tiktok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.8.35-.9.63-1.44 1.69-1.4 2.76 0 .4.1.79.27 1.15.51.81 1.41 1.29 2.37 1.29.56 0 1.11-.19 1.58-.51.78-.51 1.25-1.39 1.26-2.32V.02z" },
                                { icon: "mail", path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" }
                            ].map((social, idx) => (
                                <a key={idx} href="#" className="text-gray-500 hover:text-[#E57373] transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.path}/>
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2">
                        <h4 className="font-black text-[#E57373] text-[10px] uppercase tracking-[0.2em] mb-4 md:mb-8">Informasi</h4>
                        <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Cara Order</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Ukuran & Harga</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-black text-[#E57373] text-[10px] uppercase tracking-[0.2em] mb-4 md:mb-8">Bantuan</h4>
                        <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Pengiriman</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Pembayaran</a></li>
                            <li><a href="#" className="hover:text-[#E57373] transition-colors">Kontak</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="font-black text-[#E57373] text-[10px] uppercase tracking-[0.2em] mb-4 md:mb-8">Kontak Kami</h4>
                        <ul className="flex flex-col gap-6 text-xs font-medium text-gray-500">
                            <li className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                0812-3456-7890
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                halo@cetakfoto.com
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-[#E57373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                Jakarta, Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-3">
                        <h4 className="font-black text-[#E57373] text-[10px] uppercase tracking-[0.2em] mb-4 md:mb-8">Newsletter</h4>
                        <p className="text-gray-500 text-xs font-medium mb-6">
                            Dapatkan info promo dan tips menarik seputar fotografi.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Email kamu" 
                                className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-xs font-medium shadow-sm focus:ring-2 focus:ring-[#E57373]/20"
                            />
                            <button className="bg-[#E57373] text-white p-3 rounded-xl hover:bg-[#D32F2F] transition-colors shadow-lg shadow-red-100 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center text-[11px] font-medium text-gray-400 tracking-wider">
                    <p>© 2024 Cetak Foto. Semua hak dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}
