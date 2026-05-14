import { Link } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#FDF8F3]">
            {/* HEADER */}
            <header className="bg-white border-b border-orange-100 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E57373] rounded-lg flex items-center justify-center text-white font-black text-lg">
                        P
                    </div>
                    <h1 className="text-xl font-black tracking-tight uppercase">
                        Polaroid Generator
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link 
                        href={route('home')}
                        className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#E57373] transition-colors"
                    >
                        Beranda
                    </Link>
                </div>
            </header>

            {/* CONTENT */}
            <main className="p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}