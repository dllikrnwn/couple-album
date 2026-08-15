import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { getThemeStyle, getFrameStyle } from '../../utils/themeStyles';

export default function NoteCanvas({
  content,
  onChangeContent,
  theme,
  frame,
  stickers,
  onStickersChange,
}) {
  const canvasRef = useRef(null);
  const textareaRef = useRef(null);
  const [draggingSticker, setDraggingSticker] = useState(null);
  const [resizingSticker, setResizingSticker] = useState(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleMouseDown = (e, stickerIndex) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const sticker = stickers[stickerIndex];
    
    setDraggingSticker({
      index: stickerIndex,
      startX: e.clientX - rect.left - sticker.x,
      startY: e.clientY - rect.top - sticker.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingSticker && !resizingSticker) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (draggingSticker) {
      const newX = e.clientX - rect.left - draggingSticker.startX;
      const newY = e.clientY - rect.top - draggingSticker.startY;
      
      const updatedStickers = [...stickers];
      updatedStickers[draggingSticker.index] = {
        ...updatedStickers[draggingSticker.index],
        x: Math.max(0, Math.min(newX, rect.width - 40)),
        y: Math.max(0, Math.min(newY, rect.height - 40)),
      };
      onStickersChange(updatedStickers);
    }
    
    if (resizingSticker) {
      const newWidth = e.clientX - rect.left - resizingSticker.startX;
      const newHeight = e.clientY - rect.top - resizingSticker.startY;
      
      const updatedStickers = [...stickers];
      updatedStickers[resizingSticker.index] = {
        ...updatedStickers[resizingSticker.index],
        width: Math.max(20, Math.min(newWidth, 150)),
        height: Math.max(20, Math.min(newHeight, 150)),
      };
      onStickersChange(updatedStickers);
    }
  };

  const handleMouseUp = () => {
    setDraggingSticker(null);
    setResizingSticker(null);
  };

  const handleTouchStart = (e, stickerIndex) => {
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const sticker = stickers[stickerIndex];
    
    setDraggingSticker({
      index: stickerIndex,
      startX: touch.clientX - rect.left - sticker.x,
      startY: touch.clientY - rect.top - sticker.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!draggingSticker) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    
    const newX = touch.clientX - rect.left - draggingSticker.startX;
    const newY = touch.clientY - rect.top - draggingSticker.startY;
    
    const updatedStickers = [...stickers];
    updatedStickers[draggingSticker.index] = {
      ...updatedStickers[draggingSticker.index],
      x: Math.max(0, Math.min(newX, rect.width - 40)),
      y: Math.max(0, Math.min(newY, rect.height - 40)),
    };
    onStickersChange(updatedStickers);
  };

  const handleDeleteSticker = (index) => {
    const updatedStickers = stickers.filter((_, i) => i !== index);
    onStickersChange(updatedStickers);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [draggingSticker, resizingSticker, stickers]);

  const themeStyle = getThemeStyle(theme);
  const frameStyle = getFrameStyle(frame);

  const getStickerSrc = (sticker) => {
    if (sticker.unicode) {
      return null;
    }
    return sticker.src;
  };

  return (
    <div
      ref={canvasRef}
      className="note-canvas relative overflow-hidden"
      style={{
        width: '100%',
        minHeight: '400px',
        ...themeStyle,
        ...frameStyle,
      }}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChangeContent(e.target.value)}
        className="w-full min-h-[400px] p-8 bg-transparent resize-none focus:outline-none z-10"
        style={{
          fontFamily: 'inherit',
          fontSize: '16px',
          lineHeight: '1.6',
          color: theme === 'kraft_paper' || theme === 'wood_dark' ? '#ffffff' : '#1a1a1a',
        }}
        placeholder="Write your note here..."
      />

      {stickers.map((sticker, index) => (
        <div
          key={index}
          className="absolute cursor-move group"
          style={{
            left: sticker.x,
            top: sticker.y,
            width: sticker.width || 40,
            height: sticker.height || 40,
            zIndex: 20,
          }}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onTouchStart={(e) => handleTouchStart(e, index)}
        >
          {sticker.unicode ? (
            <span
              style={{
                fontSize: `${(sticker.width || 40) * 0.8}px`,
                userSelect: 'none',
              }}
            >
              {sticker.unicode}
            </span>
          ) : (
            <img
              src={sticker.src}
              alt={sticker.name || 'Sticker'}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          )}
          
          <button
            onClick={() => handleDeleteSticker(index)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center
                       hover:bg-red-600 z-30"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}