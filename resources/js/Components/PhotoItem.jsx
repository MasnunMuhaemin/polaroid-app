import { Image as KonvaImage } from 'react-konva';
import { useRef, useState } from 'react';

export default function PhotoItem({
    photo,
    updatePhoto,
    slot,
}) {
    const imageRef = useRef();
    const [selected, setSelected] = useState(false);

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const oldScale = photo.scaleX;
        
        // Zoom in or out
        let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        
        // Prevent zooming out beyond fill scale
        if (newScale < photo.minScale) {
            newScale = photo.minScale;
        }

        // Limit maximum zoom to 5x of minScale
        if (newScale > photo.minScale * 5) {
            newScale = photo.minScale * 5;
        }

        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - photo.x) / oldScale,
            y: (pointer.y - photo.y) / oldScale,
        };

        let newX = pointer.x - mousePointTo.x * newScale;
        let newY = pointer.y - mousePointTo.y * newScale;

        // Ensure zooming doesn't pull the image off bounds
        const maxX = slot.windowX;
        const minX = slot.windowX + slot.windowWidth - (photo.width * newScale);
        if (newX > maxX) newX = maxX;
        if (newX < minX) newX = minX;

        const maxY = slot.windowY;
        const minY = slot.windowY + slot.windowHeight - (photo.height * newScale);
        if (newY > maxY) newY = maxY;
        if (newY < minY) newY = minY;

        updatePhoto(photo.id, {
            x: newX,
            y: newY,
            scaleX: newScale,
            scaleY: newScale,
        });
    };

    return (
        <KonvaImage
            ref={imageRef}
            image={photo.image}
            x={photo.x}
            y={photo.y}
            width={photo.width}
            height={photo.height}
            scaleX={photo.scaleX}
            scaleY={photo.scaleY}
            draggable
            onDragMove={(e) => {
                const node = e.target;
                let newX = node.x();
                let newY = node.y();

                const maxX = slot.windowX;
                // Add a small epsilon to avoid floating point issues locking the drag completely
                const minX = slot.windowX + slot.windowWidth - (photo.width * node.scaleX());

                if (newX > maxX) newX = maxX;
                if (newX < minX) newX = minX;

                const maxY = slot.windowY;
                const minY = slot.windowY + slot.windowHeight - (photo.height * node.scaleY());

                if (newY > maxY) newY = maxY;
                if (newY < minY) newY = minY;

                node.x(newX);
                node.y(newY);
            }}
            onWheel={handleWheel}
            onClick={() => setSelected(true)}
            onTap={() => setSelected(true)}
            onDragEnd={(e) => {
                updatePhoto(photo.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            // Render highlight if selected, or just simple pointer
            onMouseEnter={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = 'grab';
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = 'default';
            }}
            onMouseDown={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = 'grab';
            }}
        />
    );
}