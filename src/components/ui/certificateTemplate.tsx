import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text as KonvaText } from 'react-konva';

type TextStyleKey = 'bold' | 'italic' | 'underline';

interface CertificatePreviewProps {
  image: HTMLImageElement | null;
  certificateFilePath: string | null;
  qrPosition: { x: number; y: number };
  setQrPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  qrSize: { width: number; height: number };
  setQrSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  qrImageSrc: string;
  setScale: (scale: number) => void;
  textStyle: { bold: boolean; italic: boolean; underline: boolean };
  setTextStyle: (style: TextStyleKey) => void;
  fontSize: number;
  textPosition: { x: number; y: number };
  setTextPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  fontFamily: string;
}

const getFontFamily = (isBold: boolean, fontFamily: string) => {
  if (isBold) {
    return `${fontFamily} Black`; // Replace with a specific bold font family
  } else {
    return `${fontFamily}`; // Default font family
  }
};

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  image,
  certificateFilePath,
  qrPosition,
  setQrPosition,
  qrSize,
  setQrSize,
  qrImageSrc,
  setScale,
  textStyle,
  setTextStyle,
  fontSize,
  textPosition,
  setTextPosition,
  textAlign,
  setTextAlign,
  fontFamily
}) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 600, height: 500 });
  const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null); // State for selected element

  const qrRef = useRef<any>(null);
  const qrTransformerRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const textTransformerRef = useRef<any>(null);

  useEffect(() => {
    if (image) {
      const container = document.querySelector('.canvas-container') as HTMLElement;
      if (container) {
        const containerHeight = 500;
        const containerWidth = (image.naturalWidth * containerHeight) / image.naturalHeight;
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
    const img = new Image();
    img.src = qrImageSrc;
    img.onload = () => setQrImage(img);
  }, [qrImageSrc]);

  useLayoutEffect(() => {
    if (qrRef.current && selectedElement === 'qr' && qrTransformerRef.current) {
      qrTransformerRef.current.nodes([qrRef.current]);
      qrTransformerRef.current.getLayer()?.batchDraw();
    }
  }, [qrSize, qrPosition, selectedElement]);

  useLayoutEffect(() => {
    if (textRef.current && selectedElement === 'text' && textTransformerRef.current) {
      textTransformerRef.current.nodes([textRef.current]);
      textTransformerRef.current.getLayer()?.batchDraw();
    }
  }, [textPosition, textStyle, fontSize, textAlign, selectedElement]);

  const fontFamilyLoad = getFontFamily(textStyle.bold, fontFamily);

  if (!image || !certificateFilePath || !qrImage) return null;

  return (
    <div className="h-full flex justify-center canvas-container">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        style={{ width: stageSize.width, height: stageSize.height }}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            setSelectedElement(null);
          }
        }}
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
            ref={qrRef}
            onClick={() => setSelectedElement('qr')}
            onDragEnd={(e) => {
              const newPos = { x: e.target.x(), y: e.target.y() };
              setQrPosition(newPos);
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
          <KonvaText
            text="{{ Participant Name }}"
            fontSize={fontSize}
            x={textPosition.x}
            y={textPosition.y}
            fontStyle={textStyle.italic ? 'italic' : 'normal'}
            align={textAlign}
            fontFamily={fontFamilyLoad}
            textDecoration={textStyle.underline ? 'underline' : 'none'}
            draggable
            ref={textRef}
            onClick={() => setSelectedElement('text')}
            onDragEnd={(e) => {
              const { x, y } = e.target.position();
              setTextPosition({ x, y });
            }}
          />
          {selectedElement === 'qr' && (
            <Transformer
              ref={qrTransformerRef}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              rotateEnabled={true}
              borderStrokeWidth={1}
            />
          )}
          {selectedElement === 'text' && (
            <Transformer
              ref={textTransformerRef}
              borderEnabled={true}
              borderStroke="black"
              enabledAnchors={[]} // No resize anchors
              rotateEnabled={false}
              borderStrokeWidth={2}
              boundBoxFunc={(oldBox, newBox) => oldBox} // Prevent resizing
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CertificatePreview;
