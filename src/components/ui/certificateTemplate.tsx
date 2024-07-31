import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';

interface CertificatePreviewProps {
  image: HTMLImageElement | null;
  certificateFilePath: string | null;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ image, certificateFilePath }) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 600, height: 400 });

  useEffect(() => {
    if (image) {
      // Calculate scale to fit the image within the container
      const container = document.querySelector('.canvas-container') as HTMLElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scaling factor
        const scale = Math.min(containerWidth / image.naturalWidth, containerHeight / image.naturalHeight);

        setStageSize({
          width: image.naturalWidth * scale,
          height: image.naturalHeight * scale,
        });
      }
    }
  }, [image]);

  if (!image || !certificateFilePath) return null;

  return (
    <div className="w-full h-full flex items-center justify-center canvas-container">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        style={{ width: stageSize.width, height: stageSize.height }}
      >
        <Layer>
          <KonvaImage
            image={image}
            width={stageSize.width}
            height={stageSize.height}
            x={0}
            y={0}
            alt="Certificate Preview"
          />
          <Rect
            x={50}
            y={50}
            width={100}
            height={100}
            fill="red"
            opacity={0.5}
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default CertificatePreview;
