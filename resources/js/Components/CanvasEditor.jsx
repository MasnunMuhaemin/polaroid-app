import { Stage, Layer, Rect, Group, Line, Text, Circle } from "react-konva";
import { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";

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

    // Automatically set landscape for 3R to maximize photos (10 vs 9), portrait for others
    const isLandscape = paperSize === "3R";
    const baseCanvas = {
        mediaWidth: isLandscape ? baseMediaHeight : baseMediaWidth,
        mediaHeight: isLandscape ? baseMediaWidth : baseMediaHeight,
        safeWidth: isLandscape ? baseSafeHeight : baseSafeWidth,
        safeHeight: isLandscape ? baseSafeWidth : baseSafeHeight,
        safeX: (isLandscape ? baseMediaHeight - baseSafeHeight : baseMediaWidth - baseSafeWidth) / 2,
        safeY: (isLandscape ? baseMediaWidth - baseSafeWidth : baseMediaHeight - baseSafeHeight) / 2,
    };

    // Calculate grid for the current polaroid size
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
            const frameWidth = itemWidth;
            const frameHeight = itemHeight;

            const paddingX = activeSize.padTopSide;
            const paddingYTop = activeSize.padTopSide;
            const paddingYBottom = activeSize.padBottom;

            slots.push({
                frameX,
                frameY,
                frameWidth,
                frameHeight,
                windowX: frameX + paddingX,
                windowY: frameY + paddingYTop,
                windowWidth: frameWidth - paddingX * 2,
                windowHeight: frameHeight - (paddingYTop + paddingYBottom),
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

                        const scaleToFitWidth = slot.windowWidth / img.width;
                        const scaleToFitHeight = slot.windowHeight / img.height;
                        const minScale = Math.max(scaleToFitWidth, scaleToFitHeight);
                        const scale = minScale;

                        return [
                            ...prev,
                            {
                                id: Date.now() + Math.random(),
                                image: img,
                                x: slot.windowX + (slot.windowWidth - img.width * scale) / 2,
                                y: slot.windowY + (slot.windowHeight - img.height * scale) / 2,
                                width: img.width,
                                height: img.height,
                                scaleX: scale,
                                scaleY: scale,
                                minScale: minScale,
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
                    pageIndex,
                    slotIndex,
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

    const sendToWhatsApp = async () => {
        const pdf = new jsPDF({
            orientation: baseCanvas.mediaWidth > baseCanvas.mediaHeight ? "l" : "p",
            unit: "mm",
            format: [baseCanvas.mediaWidth / 10, baseCanvas.mediaHeight / 10],
        });

        for (let i = 0; i < stageRefs.current.length; i++) {
            const stage = stageRefs.current[i];
            if (!stage) continue;
            const guideLayer = stage.findOne("#guide-layer");
            if (guideLayer) guideLayer.hide();
            stage.draw();
            const uri = stage.toDataURL({ pixelRatio: 2 });
            if (guideLayer) guideLayer.show();
            stage.draw();
            if (i > 0) pdf.addPage();
            pdf.addImage(uri, "PNG", 0, 0, baseCanvas.mediaWidth / 10, baseCanvas.mediaHeight / 10);
        }

        const fileName = `Order_${userName.replace(/\s+/g, "_") || "Pelanggan"}.pdf`;
        const pdfBlob = pdf.output("blob");
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });

        const message = `Halo Admin, saya ingin mengirimkan file orderan polaroid saya.\n\n*Detail Pelanggan:*\nNama: ${userName}\nNo. HP: ${userPhone}\nAlamat: ${userAddress}\n\n*Detail Pesanan:*\nUkuran: ${paperSize}\nTotal Foto: ${photos.length} lembar\n\nFile: ${fileName}`;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Order Polaroid",
                    text: message,
                });
                return;
            } catch (err) {
                console.error("Share failed:", err);
            }
        }

        pdf.save(fileName);
        const waMessage = message + "\n\n(Mohon lampirkan file yang baru saja didownload)";
        const adminNumber = "+6285759653234"; 
        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
    };

    const totalPages = Math.max(sheets, Math.ceil(photos.length / gridSlots.length));
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    stageRefs.current = stageRefs.current.slice(0, totalPages);

    return (
        <div className="flex flex-col gap-5 w-full max-w-full overflow-hidden">
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
                                    
                                    {/* USER INFO AT BOTTOM OF CANVAS */}
                                    {(userName || userPhone || userAddress) && (
                                        <Text
                                            x={0}
                                            y={baseCanvas.mediaHeight - 60}
                                            width={baseCanvas.mediaWidth}
                                            text={[
                                                userName && `Nama: ${userName}`,
                                                userPhone && `No. HP: ${userPhone}`,
                                                userAddress && `Alamat: ${userAddress}`,
                                                `Ukuran: ${paperSize}`,
                                                `Total: ${photos.length} Foto`
                                            ].filter(Boolean).join("  |  ")}
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
                                                <Group x={slot.windowX + slot.windowWidth - 60} y={slot.windowY + 60} onClick={() => deletePhoto(photo.id)} onTap={() => deletePhoto(photo.id)}
                                                    onMouseEnter={(e) => { e.target.getStage().container().style.cursor = "pointer"; }}
                                                    onMouseLeave={(e) => { e.target.getStage().container().style.cursor = "default"; }}
                                                >
                                                    <Circle radius={50} fill="#ff4d4f" shadowBlur={15} shadowColor="rgba(0,0,0,0.4)" stroke="white" strokeWidth={5} />
                                                    <Line points={[-15, -15, 15, 15]} stroke="white" strokeWidth={10} lineCap="round" />
                                                    <Line points={[15, -15, -15, 15]} stroke="white" strokeWidth={10} lineCap="round" />
                                                </Group>
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
        </div>
    );
}
