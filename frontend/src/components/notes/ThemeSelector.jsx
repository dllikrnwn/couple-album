import { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { getThemeName, getThemeStyle } from '../../utils/themeStyles';

const THEMES = [
  'default', 'lined_paper', 'grid_paper', 'kraft_paper',
  'pastel_pink', 'pastel_blue', 'pastel_purple', 'pastel_green',
  'floral_pink', 'floral_blue', 'polka_dots', 'watercolor',
  'vintage', 'gradient_sunset', 'kawaii'
];

export default function ThemeSelector({ selectedTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:border-rose transition-colors"
      >
        <Palette className="w-4 h-4 text-rose" />
        <span className="font-medium">{getThemeName(selectedTheme)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 grid grid-cols-3 gap-2">
            {THEMES.map((themeId) => {
              const style = getThemeStyle(themeId);
              return (
                <button
                  key={themeId}
                  onClick={() => {
                    onThemeChange(themeId);
                    setIsOpen(false);
                  }}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                    selectedTheme === themeId 
                      ? 'border-rose ring-2 ring-rose-light' 
                      : 'border-transparent hover:border-rose-light'
                  }`}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      ...style,
                      backgroundSize: style.backgroundSize || 'cover',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-1">
                    <p className="text-xs font-medium text-center truncate">
                      {getThemeName(themeId)}
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
