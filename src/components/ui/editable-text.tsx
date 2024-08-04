import React, { useState, useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
// import { KonvaEventObject } from 'konva/types/Node';

interface EditableTextProps {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  onUpdate: (newText: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  x,
  y,
  fontSize,
  textAlign,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const textRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(editText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (e.target !== inputRef.current) {
      handleBlur();
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isEditing]);

  return (
    <>
      {!isEditing ? (
        <>
          <Text
            text={text}
            x={x}
            y={y}
            fontSize={fontSize}
            align={textAlign}
            draggable
            onDblClick={handleDoubleClick}
            ref={textRef}
          />
          <Transformer
            node={textRef.current}
            ref={transformerRef}
            enabledAnchors={['middle-left', 'middle-right']}
            boundBoxFunc={(oldBox, newBox) => {
              newBox.width = Math.max(30, newBox.width);
              return newBox;
            }}
          />
        </>
      ) : (
        <foreignObject
          x={x}
          y={y}
          width={textRef.current ? textRef.current.width() : 200}
          height={fontSize * 1.2}
        >
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              height: '100%',
              fontSize: `${fontSize}px`,
              border: 'none',
              background: 'none',
              outline: 'none',
              textAlign: textAlign,
            }}
          />
        </foreignObject>
      )}
    </>
  );
};

export default EditableText;
