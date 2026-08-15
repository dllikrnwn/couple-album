import { Lock, Unlock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getThemeStyle, getFrameStyle } from '../utils/themeStyles';

export default function NoteCard({ note, showAuthor = true, showLocked = true }) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isLocked = note.is_locked && new Date() < new Date(note.unlock_date);
  
  const formatUnlockDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const themeStyle = getThemeStyle(note.theme || 'default');
  const frameStyle = getFrameStyle(note.frame || 'none');
  const stickers = note.stickers || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card p-0 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose" />
          <span className="font-semibold">
            {monthNames[note.month - 1]} {note.year}
          </span>
        </div>
        
        {isLocked ? (
          <span className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
            <Lock className="w-3 h-3" />
            Locked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            <Unlock className="w-3 h-3" />
            Unlocked
          </span>
        )}
      </div>

      <div
        className="relative min-h-[180px] sm:min-h-[300px]"
        style={{
          ...themeStyle,
          ...frameStyle,
        }}
      >
        {isLocked && showLocked ? (
          <>
            <div className="absolute inset-0 z-20">
              <div className="w-full h-full flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
                <div className="text-center px-6">
                  <Lock className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    This note is locked until end of month
                  </p>
                  <p className="text-sm text-gray-500">
                    Will unlock on {formatUnlockDate(note.unlock_date)}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="whitespace-pre-wrap blur-[6px] select-none opacity-50">
              {note.content}
            </p>
            
            {stickers.map((sticker, index) => (
              <span
                key={index}
                className="absolute"
                style={{
                  left: sticker.x,
                  top: sticker.y,
                  fontSize: `${(sticker.width || 40) * 0.8}px`,
                }}
              >
                {sticker.unicode}
              </span>
            ))}
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {note.content}
            </p>
            
            {stickers.map((sticker, index) => (
              <span
                key={index}
                className="absolute"
                style={{
                  left: sticker.x,
                  top: sticker.y,
                  fontSize: `${(sticker.width || 40) * 0.8}px`,
                }}
              >
                {sticker.unicode || (
                  <img
                    src={sticker.src}
                    alt={sticker.name || 'Sticker'}
                    style={{
                      width: sticker.width || 40,
                      height: sticker.height || 40,
                      objectFit: 'contain',
                    }}
                  />
                )}
              </span>
            ))}
          </>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        {showAuthor && (
          <p className="text-sm text-gray-500 italic">— {note.username}</p>
        )}
        
        <span className="text-xs text-gray-400 text-left sm:text-right">
          {note.theme !== 'default' && `🎨 ${note.theme.replace(/_/g, ' ')}`}
          {note.frame !== 'none' && note.theme !== 'default' && ' • '}
          {note.frame !== 'none' && `🖼️ ${note.frame.replace(/_/g, ' ')}`}
        </span>
      </div>
    </motion.div>
  );
}
