export default function Toolbar({
    mode,
    setMode,
    paperSize,
    setPaperSize,
    handleUpload,
    showGuide,
    setShowGuide,
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
    sendToWhatsApp,
}) {
    const targetTotal = sheets * capacity;
    const remaining = targetTotal - photoCount;
    const isInfoComplete = userName.trim() !== "" && userPhone.trim() !== "" && userAddress.trim() !== "";

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
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
                        Nomor HP
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

            {/* SECTION 2: SETELAN CETAK & UPLOAD */}
            <div className="flex flex-wrap items-end gap-4 justify-between">
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

                {/* ACTION SECTION */}
                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex-1 sm:flex-initial relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={!isInfoComplete}
                            onChange={handleUpload}
                            className="hidden"
                            id="photo-upload"
                        />
                        <label
                            htmlFor={isInfoComplete ? "photo-upload" : ""}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all w-full ${
                                isInfoComplete 
                                ? "bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 shadow-md active:scale-95" 
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Upload
                        </label>
                        {!isInfoComplete && (
                            <span className="absolute -bottom-5 left-0 right-0 text-[8px] text-red-400 text-center font-bold">
                                ⚠️ Lengkapi data dulu
                            </span>
                        )}
                    </div>

                    <div className="h-10 w-[1px] bg-gray-100 hidden sm:block"></div>

                    <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold mb-1 ${photoCount >= targetTotal ? 'text-green-500' : 'text-orange-400'}`}>
                            {photoCount} / {targetTotal} Foto
                        </span>
                        <button
                            onClick={sendToWhatsApp}
                            disabled={!isInfoComplete || photoCount < targetTotal}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                                isInfoComplete && photoCount >= targetTotal
                                    ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                                    : "bg-gray-50 text-gray-300 cursor-not-allowed shadow-none"
                            }`}
                        >
                            Kirim WA
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-gray-400">
                    <input
                        type="checkbox"
                        checked={showGuide}
                        onChange={(e) => setShowGuide(e.target.checked)}
                        className="w-3 h-3 rounded text-indigo-500"
                    />
                    Tampilkan Garis Pandu
                </label>
                {remaining > 0 && isInfoComplete && (
                    <span className="text-[10px] font-bold text-orange-500 animate-pulse">
                        Kurang {remaining} foto lagi untuk memenuhi target
                    </span>
                )}
            </div>
        </div>
    );
}
