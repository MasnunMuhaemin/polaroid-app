export default function Toolbar({
    mode,
    setMode,
    paperSize,
    setPaperSize,
    handleUpload,
    downloadImage,
    showGuide,
    setShowGuide,
}) {
    return (
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow">
            <input
                type="file"
                multiple
                onChange={handleUpload}
                className="border p-2 rounded"
            />

            <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="polaroid">Polaroid</option>

                <option value="grid">Grid</option>
            </select>

            <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="2R">2R (6.3 x 8.9 cm)</option>
                <option value="3R">3R (8.9 x 12.7 cm)</option>
                <option value="4R">4R (10.2 x 15.2 cm)</option>
                <option value="5R">5R (12.7 x 17.8 cm)</option>
                <option value="6R">6R (15.2 x 20.3 cm)</option>
                <option value="8R">8R (20.3 x 25.4 cm)</option>
                <option value="10R">10R (25.4 x 30.5 cm)</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={showGuide}
                    onChange={(e) => setShowGuide(e.target.checked)}
                    className="w-4 h-4 rounded"
                />
                Show Guides
            </label>

            <button
                onClick={downloadImage}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
                Download
            </button>
        </div>
    );
}
