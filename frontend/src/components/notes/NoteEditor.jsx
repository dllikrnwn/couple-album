import { useState, useEffect } from 'react';
import { Save, Eye, X } from 'lucide-react';
import NoteCanvas from './NoteCanvas';
import ThemeSelector from './ThemeSelector';
import FrameSelector from './FrameSelector';
import StickerPanel from './StickerPanel';
import { getThemeStyle, getFrameStyle } from '../../utils/themeStyles';
import { motion, AnimatePresence } from 'framer-motion';

export default function NoteEditor({ note, onSave, onCancel }) {
  const [content, setContent] = useState(note?.content || '');
  const [theme, setTheme] = useState(note?.theme || 'default');
  const [frame, setFrame] = useState(note?.frame || 'none');
  const [stickers, setStickers] = useState(note?.stickers || []);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      setTheme(note.theme || 'default');
      setFrame(note.frame || 'none');
      setStickers(note.stickers || []);
    }
  }, [note]);

  const handleStickerAdd = (sticker) => {
    setStickers([...stickers, sticker]);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please write something in your note');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        content,
        theme,
        frame,
        stickers,
      });
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-2xl font-playfair font-bold">
            {note ? 'Edit Note' : 'Write Monthly Note'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-gray-50">
          <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
          <FrameSelector selectedFrame={frame} onFrameChange={setFrame} />
          <button
            onClick={() => setShowStickerPanel(!showStickerPanel)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showStickerPanel
                ? 'bg-rose text-white'
                : 'bg-white border border-border hover:border-rose'
            }`}
          >
            ✨ Stickers
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="flex-1 p-6 overflow-y-auto min-w-0 min-h-0">
            <NoteCanvas
              content={content}
              onChangeContent={setContent}
              theme={theme}
              frame={frame}
              stickers={stickers}
              onStickersChange={setStickers}
            />
          </div>

          <AnimatePresence>
            {showStickerPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-border overflow-y-auto"
              >
                <StickerPanel onStickerAdd={handleStickerAdd} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50">
          <button
            onClick={() => setShowPreview(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <NotePreview
            content={content}
            theme={theme}
            frame={frame}
            stickers={stickers}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotePreview({ content, theme, frame, stickers, onClose }) {
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-playfair font-bold mb-4">Preview</h3>
          <div
            className="relative min-h-[400px] p-8"
            style={{
              ...getThemeStyle(theme),
              ...getFrameStyle(frame),
            }}
          >
            <p className="whitespace-pre-wrap">{content}</p>
            {stickers.map((sticker, index) => (
              <span
                key={index}
                className="absolute"
                style={{
                  left: sticker.x,
                  top: sticker.y,
                  fontSize: `${sticker.width * 0.8}px`,
                }}
              >
                {sticker.unicode || (
                  <img
                    src={sticker.src}
                    alt={sticker.name}
                    style={{ width: sticker.width, height: sticker.height }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-border">
          <button onClick={onClose} className="btn-secondary">
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
