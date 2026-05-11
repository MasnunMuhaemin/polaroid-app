import { Stage, Layer, Rect, Group, Line, Text, Circle } from "react-konva";
import { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { router, usePage } from "@inertiajs/react";

import Toolbar from "./Toolbar";
import PhotoItem from "./PhotoItem";

// The base canvas is ALWAYS 31x47cm safe area on 32.5x48.7cm media
const baseMediaWidth = 3250;
const baseMediaHeight = 4870;
const baseSafeWidth = 3100;
const baseSafeHeight = 4700;

// Available polaroid frame sizes (100px = 1cm)
const polaroidSizes = {
    "2R": { width: 600, height: 900, padTopSide: 50, padBottom: 150, w: 6, h: 9 },
    "3R": { width: 890, height: 1270, padTopSide: 70, padBottom: 200, w: 8.9, h: 12.7 },
    "4R": { width: 1016, height: 1524, padTopSide: 80, padBottom: 250, w: 10.16, h: 15.24 },
    "5R": { width: 1270, height: 1780, padTopSide: 100, padBottom: 300, w: 12.7, h: 17.8 },
    "8R": { width: 2030, height: 2540, padTopSide: 150, padBottom: 450, w: 20.3, h: 25.4 },
    "10R": { width: 2540, height: 3050, padTopSide: 200, padBottom: 550, w: 25.4, h: 30.5 },
    "Poster": { width: 3100, height: 3700, padTopSide: 250, padBottom: 650, w: 31, h: 37 },
};

export default function CanvasEditor() {
    const { flash } = usePage().props;
    const stageRefs = useRef([]);

    const [mode, setMode] = useState("polaroid");
    const [paperSize, setPaperSize] = useState("2R");
    const [photos, setPhotos] = useState([]);
    const [showGuide, setShowGuide] = useState(true);
    const [sheets, setSheets] = useState(1);
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [displayScale, setDisplayScale] = useState(0.15);

    const [orderResult, setOrderResult] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Watch for flash message from Inertia
    useEffect(() => {
        if (flash?.success && flash?.order) {
            setOrderResult(flash.order);
            setIsSaving(false);
        }
    }, [flash]);

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setDisplayScale((width - 40) / baseMediaWidth);
            } else {
                setDisplayScale(0.15);
            }
        };
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    const activeSize = polaroidSizes[paperSize] || polaroidSizes["2R"];

    const isLandscape = paperSize === "3R";
    const baseCanvas = {
        mediaWidth: isLandscape ? baseMediaHeight : baseMediaWidth,
        mediaHeight: isLandscape ? baseMediaWidth : baseMediaHeight,
        safeWidth: isLandscape ? baseSafeHeight : baseSafeWidth,
        safeHeight: isLandscape ? baseSafeWidth : baseSafeHeight,
        safeX: (isLandscape ? baseMediaHeight - baseSafeHeight : baseMediaWidth - baseSafeWidth) / 2,
        safeY: (isLandscape ? baseMediaWidth - baseSafeWidth : baseMediaHeight - baseSafeHeight) / 2,
    };

    const calculateGridSlots = () => {
        const itemWidth = activeSize.width;
        const itemHeight = activeSize.height;
        const cols = Math.floor(baseCanvas.safeWidth / itemWidth);
        const rows = Math.floor(baseCanvas.safeHeight / itemHeight);
        const gridWidth = cols * itemWidth;
        const gridHeight = rows * itemHeight;
        const gridStartX = baseCanvas.safeX + Math.floor((baseCanvas.safeWidth - gridWidth) / 2);
        const gridStartY = baseCanvas.safeY + Math.floor((baseCanvas.safeHeight - gridHeight) / 2);
        const totalSlots = cols * rows;
        const slots = [];
        for (let i = 0; i < totalSlots; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const frameX = gridStartX + col * itemWidth;
            const frameY = gridStartY + row * itemHeight;
            const paddingX = activeSize.padTopSide;
            const paddingYTop = activeSize.padTopSide;
            const paddingYBottom = activeSize.padBottom;
            slots.push({
                frameX, frameY, frameWidth: itemWidth, frameHeight: itemHeight,
                windowX: frameX + paddingX,
                windowY: frameY + paddingYTop,
                windowWidth: itemWidth - paddingX * 2,
                windowHeight: itemHeight - (paddingYTop + paddingYBottom),
            });
        }
        const cropMarks = [];
        const markLength = 30;
        for (let i = 0; i <= cols; i++) {
            const x = gridStartX + i * itemWidth;
            cropMarks.push({ points: [x, baseCanvas.safeY, x, baseCanvas.safeY - markLength] });
            cropMarks.push({ points: [x, baseCanvas.safeY + baseCanvas.safeHeight, x, baseCanvas.safeY + baseCanvas.safeHeight + markLength] });
        }
        for (let j = 0; j <= rows; j++) {
            const y = gridStartY + j * itemHeight;
            cropMarks.push({ points: [baseCanvas.safeX, y, baseCanvas.safeX - markLength, y] });
            cropMarks.push({ points: [baseCanvas.safeX + baseCanvas.safeWidth, y, baseCanvas.safeX + baseCanvas.safeWidth + markLength, y] });
        }
        return { slots, cropMarks };
    };

    const { slots: gridSlots, cropMarks } = calculateGridSlots();

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new window.Image();
                img.src = reader.result;
                img.onload = () => {
                    setPhotos((prev) => {
                        const targetTotal = gridSlots.length * sheets;
                        if (prev.length >= targetTotal) return prev;
                        const newIndex = prev.length;
                        const pageIndex = Math.floor(newIndex / gridSlots.length);
                        const slotIndex = newIndex % gridSlots.length;
                        const slot = gridSlots[slotIndex];
                        const scale = Math.max(slot.windowWidth / img.width, slot.windowHeight / img.height);
                        return [
                            ...prev,
                            {
                                id: Date.now() + Math.random(),
                                image: img,
                                file: file,
                                x: slot.windowX + (slot.windowWidth - img.width * scale) / 2,
                                y: slot.windowY + (slot.windowHeight - img.height * scale) / 2,
                                width: img.width,
                                height: img.height,
                                scaleX: scale,
                                scaleY: scale,
                                minScale: scale,
                                slotIndex: slotIndex,
                                pageIndex: pageIndex,
                            },
                        ];
                    });
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const updatePhoto = (id, newAttrs) => {
        setPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, ...newAttrs } : photo)));
    };

    const deletePhoto = (id) => {
        setPhotos((prev) => {
            const filtered = prev.filter((p) => p.id !== id);
            return filtered.map((photo, index) => {
                const pageIndex = Math.floor(index / gridSlots.length);
                const slotIndex = index % gridSlots.length;
                const slot = gridSlots[slotIndex];
                const scale = photo.scaleX;
                return {
                    ...photo,
                    pageIndex, slotIndex,
                    x: slot.windowX + (slot.windowWidth - photo.width * scale) / 2,
                    y: slot.windowY + (slot.windowHeight - photo.height * scale) / 2,
                };
            });
        });
    };

    const handlePaperSizeChange = (newSize) => {
        setPaperSize(newSize);
        setPhotos([]);
    };

    const saveOrder = async () => {
        if (photos.length === 0) return;
        setIsSaving(true);

        // Generate Order Code on client so we can put it in PDF and Text
        const clientOrderCode = 'POL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const totalPages = Math.max(sheets, Math.ceil(photos.length / gridSlots.length));

        try {
            const pdf = new jsPDF({
                orientation: baseCanvas.mediaWidth > baseCanvas.mediaHeight ? "l" : "p",
                unit: "mm",
                format: [baseCanvas.mediaWidth / 10, baseCanvas.mediaHeight / 10],
            });

            for (let i = 0; i < totalPages; i++) {
                const stage = stageRefs.current[i];
                if (!stage) continue;
                
                const guideLayer = stage.findOne("#guide-layer");
                const uiLayer = stage.findOne("#ui-layer");
                const textLayer = stage.findOne("#text-layer");
                
                // Update text for this specific page before capturing
                if (textLayer) {
                    const infoText = textLayer.findOne("Text");
                    if (infoText) {
                        infoText.text([
                            `ID: ${clientOrderCode}`,
                            `Nama: ${userName}`,
                            `Ukuran: ${paperSize}`,
                            `Halaman: ${i + 1} dari ${totalPages}`
                        ].filter(Boolean).join("  |  "));
                    }
                }

                if (guideLayer) guideLayer.hide();
                if (uiLayer) uiLayer.hide();
                
                stage.draw();
                // Increase pixelRatio to 4 for ultra-high resolution printing
                const uri = stage.toDataURL({ pixelRatio: 4 }); 
                
                if (guideLayer) guideLayer.show();
                if (uiLayer) uiLayer.show();
                
                stage.draw();
                if (i > 0) pdf.addPage();
                pdf.addImage(uri, "PNG", 0, 0, baseCanvas.mediaWidth / 10, baseCanvas.mediaHeight / 10, undefined, 'FAST');
            }

            const fileName = `${clientOrderCode}_${userName.replace(/\s+/g, "_") || "Pelanggan"}.pdf`;
            const pdfBlob = pdf.output("blob");
            const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

            router.post("/orders", {
                order_code: clientOrderCode,
                name: userName,
                phone: userPhone,
                address: userAddress,
                paper_size: paperSize,
                mode: mode,
                pdf_file: pdfFile,
                layout_json: JSON.stringify(photos.map(p => ({ id: p.id, x: p.x, y: p.y }))),
            }, {
                forceFormData: true,
                onSuccess: (page) => {
                    showToast("Order berhasil disimpan ke sistem!");
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    showToast(`Gagal: ${firstError}`, "error");
                    setIsSaving(false);
                },
                onFinish: () => {
                    setIsSaving(false);
                }
            });
        } catch (err) {
            console.error("Save order failed:", err);
            showToast("Terjadi kesalahan teknis. Silakan coba lagi.", "error");
            setIsSaving(false);
        }
    };

    const sendToWhatsApp = () => {
        if (!orderResult) return;
        const totalPages = Math.max(sheets, Math.ceil(photos.length / gridSlots.length));
        
        const message = `Halo Admin, saya ingin mengkonfirmasi orderan polaroid saya.\n\n` +
            `*KODE ORDER: ${orderResult.order_code}*\n` +
            `----------------------------------\n` +
            `*DATA PELANGGAN*\n` +
            `Nama: ${orderResult.name}\n` +
            `No. WA: ${userPhone}\n` +
            `Alamat: ${userAddress}\n\n` +
            `*DETAIL ORDER*\n` +
            `Ukuran: ${paperSize}\n` +
            `Total: ${photos.length} Foto\n` +
            `Jumlah: ${totalPages} Lembar Cetak\n` +
            `----------------------------------\n` +
            `Mohon segera diproses ya, terima kasih!`;

        const adminNumber = "6285759653234"; 
        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const totalPages = Math.max(sheets, Math.ceil(photos.length / gridSlots.length));
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    stageRefs.current = stageRefs.current.slice(0, totalPages);

    return (
        <div className="flex flex-col gap-5 w-full max-w-full overflow-hidden relative">
            {/* SUCCESS MODAL OVERLAY */}
            {orderResult && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden animate-zoom-in">
                        <div className="h-2 bg-gradient-to-r from-green-400 to-indigo-600"></div>
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-inner animate-bounce-subtle">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Berhasil!</h2>
                            <p className="text-gray-500 font-medium mb-8">Data Anda telah aman tersimpan di sistem kami. Silakan konfirmasi ke WhatsApp untuk proses cetak.</p>
                            
                            <div className="bg-indigo-50 w-full p-4 rounded-2xl border-2 border-indigo-100 mb-8 flex flex-col gap-1">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Kode Pesanan Anda</span>
                                <span className="text-2xl font-black text-indigo-700 tracking-wider select-all">{orderResult.order_code}</span>
                            </div>

                            <button
                                onClick={sendToWhatsApp}
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white rounded-2xl font-black text-xl hover:bg-[#128C7E] transition-all shadow-[0_20px_40px_rgba(37,211,102,0.4)] active:scale-95 group"
                            >
                                <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448L0 .057zm6.544-3.52c1.603.953 3.411 1.455 5.253 1.456 5.532 0 10.034-4.502 10.036-10.035.001-2.684-1.045-5.205-2.946-7.107s-4.423-2.945-7.106-2.946c-5.533 0-10.035 4.502-10.038 10.036-.001 1.771.464 3.498 1.345 5.019L2.182 20.91l4.419-1.43zm12.386-7.391c-.301-.15-1.777-.878-2.051-.978-.275-.1-.475-.15-.675.15-.2.3-.776.978-.951 1.178-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.491-1.778-1.666-2.078-.175-.3-.018-.463.132-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.583-.493-.503-.675-.512-.175-.009-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.124 4.535.715.311 1.274.497 1.708.635.719.227 1.374.196 1.89.118.575-.088 1.777-.726 2.027-1.427.25-.7.25-1.3.175-1.427-.075-.125-.275-.2-.575-.35z" />
                                </svg>
                                Konfirmasi di WhatsApp
                            </button>
                            
                            <button 
                                onClick={() => setOrderResult(null)}
                                className="mt-6 text-gray-400 font-bold text-sm hover:text-indigo-600 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-2xl shadow-2xl border-2 flex items-center gap-3 animate-slide-down ${
                    toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                    </div>
                    <span className="font-black text-lg">{toast.message}</span>
                </div>
            )}

            <Toolbar
                mode={mode} setMode={setMode}
                paperSize={paperSize} setPaperSize={handlePaperSizeChange}
                handleUpload={handleUpload}
                showGuide={showGuide} setShowGuide={setShowGuide}
                sheets={sheets} setSheets={setSheets}
                capacity={gridSlots.length}
                userName={userName} setUserName={setUserName}
                userPhone={userPhone} setUserPhone={setUserPhone}
                userAddress={userAddress} setUserAddress={setUserAddress}
                photoCount={photos.length}
                saveOrder={saveOrder}
                isSaving={isSaving}
                orderResult={orderResult}
                sendToWhatsApp={sendToWhatsApp}
            />

            <div className="flex flex-col gap-12 items-center py-8 bg-gray-100 rounded-xl overflow-x-auto min-h-[600px]">
                {pages.map((pageIndex) => (
                    <div key={pageIndex} className="flex flex-col items-center gap-4">
                        <div className="bg-white shadow-2xl p-0">
                            <Stage
                                width={baseCanvas.mediaWidth * displayScale}
                                height={baseCanvas.mediaHeight * displayScale}
                                scaleX={displayScale}
                                scaleY={displayScale}
                                ref={(el) => (stageRefs.current[pageIndex] = el)}
                            >
                                <Layer>
                                    <Rect width={baseCanvas.mediaWidth} height={baseCanvas.mediaHeight} fill="white" />
                                </Layer>
                                <Layer id="text-layer">
                                    {(userName || userPhone || userAddress) && (
                                        <Text
                                            x={0}
                                            y={baseCanvas.mediaHeight - 60}
                                            width={baseCanvas.mediaWidth}
                                            text="Menyiapkan Dokumen..."
                                            fontSize={35}
                                            fontStyle="bold"
                                            align="center"
                                            fill="#444444"
                                        />
                                    )}
                                </Layer>
                                <Layer id="frame-layer">
                                    {gridSlots.map((slot, idx) => (
                                        <Group key={idx}>
                                            <Rect x={slot.frameX} y={slot.frameY} width={slot.frameWidth} height={slot.frameHeight} fill="white" stroke="#cccccc" strokeWidth={1} listening={false} />
                                            <Rect x={slot.windowX} y={slot.windowY} width={slot.windowWidth} height={slot.windowHeight} stroke="rgba(0,0,0,0.05)" strokeWidth={4} listening={false} />
                                        </Group>
                                    ))}
                                    {cropMarks.map((mark, idx) => (
                                        <Line key={`crop-${idx}`} points={mark.points} stroke="black" strokeWidth={2} listening={false} />
                                    ))}
                                </Layer>
                                <Layer id="photo-layer">
                                    {photos.filter((p) => p.pageIndex === pageIndex).map((photo) => {
                                        const slot = gridSlots[photo.slotIndex];
                                        if (!slot) return null;
                                        return (
                                            <Group key={photo.id}>
                                                <Group clipX={slot.windowX} clipY={slot.windowY} clipWidth={slot.windowWidth} clipHeight={slot.windowHeight}>
                                                    <PhotoItem photo={photo} updatePhoto={updatePhoto} slot={slot} />
                                                </Group>
                                            </Group>
                                        );
                                    })}
                                </Layer>
                                <Layer id="ui-layer">
                                    {photos.filter((p) => p.pageIndex === pageIndex).map((photo) => {
                                        const slot = gridSlots[photo.slotIndex];
                                        if (!slot) return null;
                                        return (
                                            <Group key={`ui-${photo.id}`} x={slot.windowX + slot.windowWidth - 60} y={slot.windowY + 60} onClick={() => deletePhoto(photo.id)} onTap={() => deletePhoto(photo.id)}
                                                onMouseEnter={(e) => { e.target.getStage().container().style.cursor = "pointer"; }}
                                                onMouseLeave={(e) => { e.target.getStage().container().style.cursor = "default"; }}
                                            >
                                                <Circle radius={50} fill="#ff4d4f" shadowBlur={15} shadowColor="rgba(0,0,0,0.4)" stroke="white" strokeWidth={5} />
                                                <Line points={[-15, -15, 15, 15]} stroke="white" strokeWidth={10} lineCap="round" />
                                                <Line points={[15, -15, -15, 15]} stroke="white" strokeWidth={10} lineCap="round" />
                                            </Group>
                                        );
                                    })}
                                </Layer>
                                <Layer id="guide-layer" visible={showGuide}>
                                    <Rect x={0} y={0} width={baseCanvas.mediaWidth} height={baseCanvas.mediaHeight} stroke="red" strokeWidth={10} dash={[40, 40]} listening={false} />
                                    <Rect x={baseCanvas.safeX} y={baseCanvas.safeY} width={baseCanvas.safeWidth} height={baseCanvas.safeHeight} stroke="green" strokeWidth={10} dash={[40, 40]} listening={false} />
                                </Layer>
                            </Stage>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slide-down {
                    0% { transform: translate(-50%, -100%); opacity: 0; }
                    100% { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-slide-down {
                    animation: slide-down 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
        </div>
    );
}
