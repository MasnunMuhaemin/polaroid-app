import { Group, Rect } from "react-konva";

export default function PolaroidFrame({ children, photo, mode }) {
    if (mode === "grid") {
        return <Group>{children}</Group>;
    }

    return (
        <Group>
            {/* FRAME PUTIH */}

            <Rect
                x={photo.x - 15}
                y={photo.y - 15}
                width={photo.width * photo.scaleX + 30}
                height={photo.height * photo.scaleY + 80}
                fill="white"
                shadowBlur={10}
                cornerRadius={5}
            />

            {children}
        </Group>
    );
}
