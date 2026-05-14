export default function SizeCard({ name, size, img }) {
    return (
        <div className="group cursor-pointer">
            {/* White frame - image top, label bottom */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                {/* Image - full width top */}
                <div className="aspect-[3/4] overflow-hidden">
                    <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Label inside white frame */}
                <div className="text-center py-4 px-3">
                    <p className="font-black text-sm text-gray-800 uppercase tracking-wider">{name}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">{size}</p>
                </div>
            </div>
        </div>
    );
}
