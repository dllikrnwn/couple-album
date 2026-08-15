import { useState } from 'react';
import { Square, ChevronDown } from 'lucide-react';
import { getFrameName, getFrameStyle } from '../../utils/themeStyles';

const FRAMES = [
  'none', 'simple_black', 'simple_white', 'polaroid_white',
  'polaroid_black', 'wood_light', 'wood_dark', 'gold_classic',
  'tape', 'hearts_border'
];

export default function FrameSelector({ selectedFrame, onFrameChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:border-rose transition-colors"
      >
        <Square className="w-4 h-4 text-rose" />
        <span className="font-medium">{getFrameName(selectedFrame)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto overscroll-contain">
          <div className="p-2 grid grid-cols-2 gap-2">
            {FRAMES.map((frameId) => {
              const style = getFrameStyle(frameId);
              return (
                <button
                  key={frameId}
                  onClick={() => {
                    onFrameChange(frameId);
                    setIsOpen(false);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all bg-gray-50 ${
                    selectedFrame === frameId 
                      ? 'border-rose ring-2 ring-rose-light' 
                      : 'border-gray-200 hover:border-rose-light'
                  }`}
                >
                  <div 
                    className="absolute inset-4 bg-white"
                    style={{
                      border: style.border || 'none',
                      boxShadow: style.boxShadow || 'none',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-1">
                    <p className="text-xs font-medium text-center truncate">
                      {getFrameName(frameId)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
