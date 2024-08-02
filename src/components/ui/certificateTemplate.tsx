import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';

interface CertificatePreviewProps {
  image: HTMLImageElement | null;
  certificateFilePath: string | null;
  qrPosition: { x: number; y: number };
  setQrPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  qrSize: { width: number; height: number };
  setQrSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  qrImageSrc: string; // Add QR image source prop
  setScale: (scale: number) => void; // Add setScale prop
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  image,
  certificateFilePath,
  qrPosition,
  setQrPosition,
  qrSize,
  setQrSize,
  qrImageSrc, // Add QR image source prop
  setScale, // Add setScale prop
}) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 600, height: 400 });
  const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (image) {
      // Calculate scale to fit the image within the container
      const container = document.querySelector('.canvas-container') as HTMLElement;
      if (container) {
        const containerHeight = 600;
        const containerWidth = (image.naturalWidth * containerHeight) / image.naturalHeight;
        console.log(containerWidth, containerHeight);
        
        // Calculate scaling factor
        const newScale = Math.min(image.naturalWidth / containerWidth, image.naturalHeight / containerHeight);

        setScale(newScale);

        setStageSize({
          width: containerWidth,
          height: containerHeight,
        });
      }
    }
  }, [image]);

  useEffect(() => {
    // Load the QR image
    const img = new Image();
    img.src = qrImageSrc;
    img.onload = () => setQrImage(img);
  }, [qrImageSrc]);

  if (!image || !certificateFilePath || !qrImage) return null;

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
          <KonvaImage
            image={qrImage}
            x={qrPosition.x}
            y={qrPosition.y}
            width={qrSize.width}
            height={qrSize.height}
            draggable
            onDragEnd={(e) => {
              const newPos = { x: e.target.x(), y: e.target.y() };
              setQrPosition(newPos);
              console.log('QR Position:', newPos);
            }}
            onTransformEnd={(e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              setQrSize({
                width: Math.max(50, node.width() * scaleX),
                height: Math.max(50, node.height() * scaleY),
              });
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default CertificatePreview;
