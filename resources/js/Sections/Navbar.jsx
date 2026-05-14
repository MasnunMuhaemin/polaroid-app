import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#E57373] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">
                        P
                    </div>
                    <span className="text-xl font-black tracking-tight font-outfit uppercase">Polaroid.App</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <a href="#how-it-works" className="hover:text-[#E57373] transition-colors">Cara Order</a>
                    <a href="#sizes" className="hover:text-[#E57373] transition-colors">Ukuran</a>
                    <a href="#benefits" className="hover:text-[#E57373] transition-colors">Keunggulan</a>
                </div>

                <Link 
                    href={route('editor')}
                    className="px-6 py-3 bg-[#E57373] text-white rounded-full font-black text-sm uppercase tracking-wider hover:bg-[#D32F2F] transition-all shadow-xl shadow-red-200 active:scale-95"
                >
                    Mulai Cetak
                </Link>
            </div>
        </nav>
    );
}
