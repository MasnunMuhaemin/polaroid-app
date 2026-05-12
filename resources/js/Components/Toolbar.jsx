export default function Toolbar({
    mode,
    setMode,
    paperSize,
    setPaperSize,
    handleUpload,

    sheets,
    setSheets,
    capacity,
    userName,
    setUserName,
    userPhone,
    setUserPhone,
    userAddress,
    setUserAddress,
    photoCount,
    saveOrder,
    isSaving,
    orderResult,
    sendToWhatsApp,
}) {
    const targetTotal = sheets * capacity;
    const remaining = targetTotal - photoCount;
    const isInfoComplete = userName.trim() !== "" && userPhone.trim() !== "" && userAddress.trim() !== "";

    if (orderResult) {
        return (
            <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-2xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-gray-900 font-black text-2xl tracking-tight">Order Berhasil Disimpan!</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
                                    ID: {orderResult.order_code}
                                </span>
                                <span className="text-gray-400 text-xs font-bold">•</span>
                                <span className="text-gray-600 text-xs font-bold">{userName}</span>
                                <span className="text-gray-400 text-xs font-bold">•</span>
                                <span className="text-gray-600 text-xs font-bold">{paperSize} - {photoCount} Foto</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={sendToWhatsApp}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black text-xl hover:bg-[#128C7E] transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] active:scale-95 group"
                        >
                            <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448L0 .057zm6.544-3.52c1.603.953 3.411 1.455 5.253 1.456 5.532 0 10.034-4.502 10.036-10.035.001-2.684-1.045-5.205-2.946-7.107s-4.423-2.945-7.106-2.946c-5.533 0-10.035 4.502-10.038 10.036-.001 1.771.464 3.498 1.345 5.019L2.182 20.91l4.419-1.43zm12.386-7.391c-.301-.15-1.777-.878-2.051-.978-.275-.1-.475-.15-.675.15-.2.3-.776.978-.951 1.178-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.491-1.778-1.666-2.078-.175-.3-.018-.463.132-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.583-.493-.503-.675-.512-.175-.009-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.124 4.535.715.311 1.274.497 1.708.635.719.227 1.374.196 1.89.118.575-.088 1.777-.726 2.027-1.427.25-.7.25-1.3.175-1.427-.075-.125-.275-.2-.575-.35z" />
                            </svg>
                            Konfirmasi Order di WhatsApp
                        </button>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Klik tombol di atas untuk mengirim detail order</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            {/* SECTION 2: SETELAN CETAK & UPLOAD */}
            <div className="flex flex-wrap items-end gap-4 justify-between border-b pb-4 mb-2">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Model</span>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="border border-gray-200 p-2 rounded-lg text-sm font-bold bg-gray-50 focus:border-indigo-500"
                        >
                            <option value="polaroid">Polaroid</option>
                            <option value="grid">Grid</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Ukuran</span>
                        <select
                            value={paperSize}
                            onChange={(e) => setPaperSize(e.target.value)}
                            className="border border-gray-200 p-2 rounded-lg text-sm font-bold bg-gray-50 focus:border-indigo-500"
                        >
                            <option value="2R">2R (6 x 9 cm)</option>
                            <option value="3R">3R (8.9 x 12.7 cm)</option>
                            <option value="4R">4R (10.16 x 15.24 cm)</option>
                            <option value="5R">5R (12.7 x 17.8 cm)</option>
                            <option value="8R">8R (20.3 x 25.4 cm)</option>
                            <option value="10R">10R (25.4 x 30.5 cm)</option>
                            <option value="Poster">Poster (31 x 37 cm)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Target Foto</span>
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-100">
                            {[1, 2, 3, 4].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSheets(s)}
                                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                                        sheets === s
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "hover:bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {s * capacity}
                                </button>
                            ))}
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <input
                                type="number"
                                min={capacity}
                                step={capacity}
                                value={sheets * capacity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || capacity;
                                    setSheets(Math.max(1, Math.floor(val / capacity)));
                                }}
                                className="w-12 bg-transparent border-none text-xs font-bold text-indigo-600 focus:ring-0 p-0 text-center"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 sm:flex-initial relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 shadow-md active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Foto
                    </label>
                </div>
            </div>

            {/* SECTION 1: DATA PELANGGAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[8px]">1</span>
                        Nama Pelanggan
                    </span>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Input Nama..."
                        className="border-none p-0 py-1 text-sm font-bold focus:ring-0 bg-transparent placeholder:text-gray-300"
                    />
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[8px]">2</span>
                        Nomor WA
                    </span>
                    <input
                        type="tel"
                        value={userPhone}
                        maxLength={13}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 13);
                            setUserPhone(val);
                        }}
                        placeholder="08xxxxxxxxxx"
                        className="border-none p-0 py-1 text-sm font-bold focus:ring-0 bg-transparent placeholder:text-gray-300"
                    />
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[8px]">3</span>
                        Alamat Lengkap
                    </span>
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        placeholder="Alamat Lengkap..."
                        className="border-none p-0 py-1 text-sm font-bold focus:ring-0 bg-transparent placeholder:text-gray-300"
                    />
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${photoCount >= targetTotal ? 'text-green-500' : 'text-orange-400'}`}>
                        {photoCount} / {targetTotal} Foto
                    </span>
                    {remaining > 0 && (
                        <span className="text-[9px] font-bold text-orange-500 animate-pulse">
                            Kurang {remaining} foto lagi
                        </span>
                    )}
                </div>

                <button
                    onClick={saveOrder}
                    disabled={!isInfoComplete || photoCount < targetTotal || isSaving}
                    className={`flex items-center gap-2 px-10 py-3 rounded-2xl font-black text-lg transition-all shadow-xl ${
                        isInfoComplete && photoCount >= targetTotal && !isSaving
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                    }`}
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        "Simpan Order"
                    )}
                </button>
            </div>
        </div>
    );
}
