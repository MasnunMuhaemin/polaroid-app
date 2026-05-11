import { Stage, Layer, Rect, Group, Line } from "react-konva";
import { useRef, useState } from "react";

import Toolbar from "./Toolbar";
import PhotoItem from "./PhotoItem";

// The base canvas is ALWAYS 31x46cm safe area on 32.5x48cm media
const baseMediaWidth = 3250;
const baseMediaHeight = 4800;
// Diperlebar menjadi 31.5cm agar 5 kolom ukuran 6.3cm (2R) dapat muat tepat (5 x 6.3 = 31.5) menghasilkan 25 foto
const baseSafeWidth = 3150;
const baseSafeHeight = 4600;

// Available polaroid frame sizes (100px = 1cm)
const polaroidSizes = {
    "2R": { width: 630, height: 890, padTopSide: 50, padBottom: 150 },
    "3R": { width: 890, height: 1270, padTopSide: 70, padBottom: 200 },
    "4R": { width: 1020, height: 1520, padTopSide: 80, padBottom: 250 },
    "5R": { width: 1270, height: 1780, padTopSide: 100, padBottom: 300 },
    "6R": { width: 1520, height: 2030, padTopSide: 120, padBottom: 350 },
    "8R": { width: 2030, height: 2540, padTopSide: 150, padBottom: 450 },
    "10R": { width: 2540, height: 3050, padTopSide: 200, padBottom: 550 },
};

export default function CanvasEditor() {
    const stageRefs = useRef([]);

    const [mode, setMode] = useState("polaroid");
    const [paperSize, setPaperSize] = useState("2R");
    const [photos, setPhotos] = useState([]);
    const [showGuide, setShowGuide] = useState(true);

    const activeSize = polaroidSizes[paperSize] || polaroidSizes["2R"];

    // Automatically set landscape for 3R to maximize photos (10 vs 9), portrait for others
    const isLandscape = paperSize === "3R";
    const baseCanvas = {
        mediaWidth: isLandscape ? baseMediaHeight : baseMediaWidth,
        mediaHeight: isLandscape ? baseMediaWidth : baseMediaHeight,
        safeWidth: isLandscape ? baseSafeHeight : baseSafeWidth,
        safeHeight: isLandscape ? baseSafeWidth : baseSafeHeight,
        safeX:
            (isLandscape
                ? baseMediaHeight - baseSafeHeight
                : baseMediaWidth - baseSafeWidth) / 2,
        safeY:
            (isLandscape
                ? baseMediaWidth - baseSafeWidth
                : baseMediaHeight - baseSafeHeight) / 2,
    };

    // Calculate grid for the current polaroid size
    const calculateGridSlots = () => {
        const itemWidth = activeSize.width;
        const itemHeight = activeSize.height;

        const cols = Math.floor(baseCanvas.safeWidth / itemWidth);
        const rows = Math.floor(baseCanvas.safeHeight / itemHeight);

        // Nol jarak antar foto
        const gapX = 0;
        const gapY = 0;

        const gridWidth = cols * itemWidth;
        const gridHeight = rows * itemHeight;

        // Pusatkan grid di tengah safe area
        const gridStartX =
            baseCanvas.safeX +
            Math.floor((baseCanvas.safeWidth - gridWidth) / 2);
        const gridStartY =
            baseCanvas.safeY +
            Math.floor((baseCanvas.safeHeight - gridHeight) / 2);

        const totalSlots = cols * rows;
        const slots = [];

        for (let i = 0; i < totalSlots; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Determine frame bounds
            const frameX = gridStartX + col * itemWidth;
            const frameY = gridStartY + row * itemHeight;
            const frameWidth = itemWidth;
            const frameHeight = itemHeight;

            // Gunakan standar padding dari definisi ukuran polaroid
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

        // Generate Crop Marks outside Safe Area
        const cropMarks = [];
        const markLength = 30; // Panjang marking potong di luar safe area

        // Vertical cuts
        for (let i = 0; i <= cols; i++) {
            const x = gridStartX + i * itemWidth;
            // Top mark (dari batas atas safe area ke luar)
            cropMarks.push({
                points: [x, baseCanvas.safeY, x, baseCanvas.safeY - markLength],
            });
            // Bottom mark (dari batas bawah safe area ke luar)
            cropMarks.push({
                points: [
                    x,
                    baseCanvas.safeY + baseCanvas.safeHeight,
                    x,
                    baseCanvas.safeY + baseCanvas.safeHeight + markLength,
                ],
            });
        }

        // Horizontal cuts
        for (let j = 0; j <= rows; j++) {
            const y = gridStartY + j * itemHeight;
            // Left mark (dari batas kiri safe area ke luar)
            cropMarks.push({
                points: [baseCanvas.safeX, y, baseCanvas.safeX - markLength, y],
            });
            // Right mark (dari batas kanan safe area ke luar)
            cropMarks.push({
                points: [
                    baseCanvas.safeX + baseCanvas.safeWidth,
                    y,
                    baseCanvas.safeX + baseCanvas.safeWidth + markLength,
                    y,
                ],
            });
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
                        const newIndex = prev.length;
                        const pageIndex = Math.floor(
                            newIndex / gridSlots.length,
                        );
                        const slotIndex = newIndex % gridSlots.length;
                        const slot = gridSlots[slotIndex];

                        const scaleToFitWidth = slot.windowWidth / img.width;
                        const scaleToFitHeight = slot.windowHeight / img.height;
                        const minScale = Math.max(
                            scaleToFitWidth,
                            scaleToFitHeight,
                        );
                        const scale = minScale; // initial scale is fill

                        return [
                            ...prev,
                            {
                                id: Date.now() + Math.random(),
                                image: img,
                                x:
                                    slot.windowX +
                                    (slot.windowWidth - img.width * scale) / 2,
                                y:
                                    slot.windowY +
                                    (slot.windowHeight - img.height * scale) /
                                        2,
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
        setPhotos((prev) =>
            prev.map((photo) =>
                photo.id === id ? { ...photo, ...newAttrs } : photo,
            ),
        );
    };

    const handlePaperSizeChange = (newSize) => {
        setPaperSize(newSize);
        setPhotos([]); // Clear existing photos when changing polaroid grid size
    };

    const downloadImage = () => {
        stageRefs.current.forEach((stage, idx) => {
            if (!stage) return;

            // Hide guide layer before export
            const guideLayer = stage.findOne("#guide-layer");
            if (guideLayer) guideLayer.hide();

            stage.draw();

            // Export the full media size (32.5x48) so the crop marks are visible
            const uri = stage.toDataURL({
                x: 0,
                y: 0,
                width: baseCanvas.mediaWidth,
                height: baseCanvas.mediaHeight,
                pixelRatio: 1, // Full size export
            });

            if (guideLayer) guideLayer.show();
            stage.draw();

            const link = document.createElement("a");
            link.download = `polaroid-print-${paperSize}-page-${idx + 1}.png`;
            link.href = uri;
            link.click();
        });
    };

    const displayScale = 0.15;

    const totalPages = Math.max(1, Math.ceil(photos.length / gridSlots.length));
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    // Keep array of refs matching exactly the number of pages
    stageRefs.current = stageRefs.current.slice(0, totalPages);

    return (
        <div className="flex flex-col gap-5">
            <Toolbar
                mode={mode}
                setMode={setMode}
                paperSize={paperSize}
                setPaperSize={handlePaperSizeChange}
                handleUpload={handleUpload}
                downloadImage={downloadImage}
                showGuide={showGuide}
                setShowGuide={setShowGuide}
            />

            <div className="flex flex-col gap-10 bg-gray-100 p-5 rounded-lg overflow-auto max-h-[80vh]">
                {pages.map((pageIndex) => (
                    <div key={pageIndex} className="flex flex-col items-center">
                        <h3 className="mb-2 font-bold text-gray-700">
                            Halaman {pageIndex + 1}
                        </h3>
                        <div className="overflow-auto border rounded-lg bg-gray-300 p-5 flex justify-center shadow-inner">
                            <Stage
                                width={baseCanvas.mediaWidth * displayScale}
                                height={baseCanvas.mediaHeight * displayScale}
                                scaleX={displayScale}
                                scaleY={displayScale}
                                ref={(node) => {
                                    stageRefs.current[pageIndex] = node;
                                }}
                                className="bg-transparent mx-auto shadow-lg"
                            >
                                {/* LAYER 1: BACKGROUND (Kertas) */}
                                <Layer id="background-layer">
                                    <Rect
                                        x={0}
                                        y={0}
                                        width={baseCanvas.mediaWidth}
                                        height={baseCanvas.mediaHeight}
                                        fill="white"
                                    />
                                </Layer>

                                {/* LAYER 2: POLAROID FRAMES */}
                                <Layer id="frame-layer">
                                    {gridSlots.map((slot, idx) => {
                                        const {
                                            frameX,
                                            frameY,
                                            frameWidth,
                                            frameHeight,
                                        } = slot;

                                        return (
                                            <Group key={idx}>
                                                {/* Polaroid White Card */}
                                                <Rect
                                                    x={frameX}
                                                    y={frameY}
                                                    width={frameWidth}
                                                    height={frameHeight}
                                                    fill="white"
                                                    stroke="#cccccc"
                                                    strokeWidth={1}
                                                    listening={false}
                                                />
                                                {/* Inner stroke to define the photo window */}
                                                <Rect
                                                    x={slot.windowX}
                                                    y={slot.windowY}
                                                    width={slot.windowWidth}
                                                    height={slot.windowHeight}
                                                    stroke="rgba(0,0,0,0.05)"
                                                    strokeWidth={4}
                                                    listening={false}
                                                />
                                            </Group>
                                        );
                                    })}

                                    {/* --- CROP MARKS (Ditempatkan di luar zona aman / Bleed area) --- */}
                                    {cropMarks.map((mark, idx) => (
                                        <Line
                                            key={`crop-${idx}`}
                                            points={mark.points}
                                            stroke="black"
                                            strokeWidth={2}
                                            listening={false}
                                        />
                                    ))}
                                </Layer>

                                {/* LAYER 3: PHOTOS */}
                                <Layer id="photo-layer">
                                    {photos
                                        .filter(
                                            (p) => p.pageIndex === pageIndex,
                                        )
                                        .map((photo) => {
                                            const slot =
                                                gridSlots[photo.slotIndex];
                                            if (!slot) return null;

                                            return (
                                                <Group
                                                    key={photo.id}
                                                    clipX={slot.windowX}
                                                    clipY={slot.windowY}
                                                    clipWidth={slot.windowWidth}
                                                    clipHeight={
                                                        slot.windowHeight
                                                    }
                                                >
                                                    <PhotoItem
                                                        photo={photo}
                                                        updatePhoto={
                                                            updatePhoto
                                                        }
                                                        slot={slot}
                                                    />
                                                </Group>
                                            );
                                        })}
                                </Layer>

                                {/* LAYER 4: GUIDE */}
                                <Layer id="guide-layer" visible={showGuide}>
                                    {/* Bleed Area / Media Edge */}
                                    <Rect
                                        x={0}
                                        y={0}
                                        width={baseCanvas.mediaWidth}
                                        height={baseCanvas.mediaHeight}
                                        stroke="red"
                                        strokeWidth={10}
                                        dash={[40, 40]}
                                        listening={false}
                                    />
                                    {/* Safe Area */}
                                    <Rect
                                        x={baseCanvas.safeX}
                                        y={baseCanvas.safeY}
                                        width={baseCanvas.safeWidth}
                                        height={baseCanvas.safeHeight}
                                        stroke="green"
                                        strokeWidth={10}
                                        dash={[40, 40]}
                                        listening={false}
                                    />
                                </Layer>
                            </Stage>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
