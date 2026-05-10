import { Image as KonvaImage, Transformer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';

export default function PhotoItem({
    photo,
    updatePhoto,
}) {

    const imageRef = useRef();

    const transformerRef = useRef();

    const [selected, setSelected] = useState(false);

    useEffect(() => {

        if (selected) {

            transformerRef.current.nodes([
                imageRef.current
            ]);

            transformerRef.current.getLayer().batchDraw();
        }

    }, [selected]);

    return (
        <>
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
                onClick={() => setSelected(true)}
                onTap={() => setSelected(true)}
                onDragEnd={(e) => {

                    updatePhoto(photo.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                    });

                }}
                onTransformEnd={() => {

                    const node = imageRef.current;

                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    updatePhoto(photo.id, {
                        x: node.x(),
                        y: node.y(),
                        scaleX,
                        scaleY,
                    });

                }}
            />

            {selected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    keepRatio={true}
                />
            )}
        </>
    );
}