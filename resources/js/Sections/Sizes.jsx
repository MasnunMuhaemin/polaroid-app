import { Link } from '@inertiajs/react';
import SizeCard from '@/Components/SizeCard';

const sizes = [
    {
        name: "INSTAX",
        size: "8.6 x 5.4 cm",
        img: "https://images.unsplash.com/photo-1612459284270-1e7da3a8fca1?q=80&w=600&auto=format&fit=crop",
    },
    {
        name: "10R",
        size: "10.2 x 15.2 cm",
        img: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?q=80&w=600&auto=format&fit=crop",
    },
    {
        name: "13R",
        size: "12.7 x 17.8 cm",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
    },
    {
        name: "A4",
        size: "21 x 29.7 cm",
        img: "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?q=80&w=600&auto=format&fit=crop",
    },
];

export default function Sizes() {
    return (
        <section id="sizes" className="py-20 bg-[#FDF8F3]">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* LEFT: Text */}
                    <div className="lg:w-60 shrink-0 text-center lg:text-left">
                        <span className="text-[10px] font-black text-[#E57373] uppercase tracking-[0.3em] mb-4 block">
                            UKURAN FAVORIT ❤️
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-outfit leading-tight mb-4">
                            Pilihan Ukuran Untuk Setiap Momen
                        </h2>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            Dari momen kecil hingga momen besar, kami punya ukuran yang pas untukmu.
                        </p>
                        <Link
                            href={route('editor')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 bg-[#E57373] text-white rounded-full font-black text-[10px] md:text-sm uppercase tracking-wider hover:bg-[#D32F2F] transition-all shadow-lg shadow-red-200 active:scale-95"
                        >
                            Lihat Semua Ukuran
                        </Link>
                    </div>

                    {/* RIGHT: Size Cards */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {sizes.map((size, idx) => (
                                <SizeCard
                                    key={idx}
                                    name={size.name}
                                    size={size.size}
                                    img={size.img}
                                />
                            ))}
                        </div>

                        {/* Lihat semua link */}
                        <div className="mt-8 text-center">
                            <Link
                                href={route('editor')}
                                className="inline-flex items-center gap-2 text-[#E57373] font-black text-sm hover:gap-4 transition-all"
                            >
                                Lihat semua ukuran
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
