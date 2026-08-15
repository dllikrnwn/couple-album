import { useState } from 'react';
import { Smile, Image as ImageIcon, Search } from 'lucide-react';
import { assetUrl } from '../../utils/api';

const EMOJI_STICKERS = [
  { id: 'heart', unicode: '❤️', category: 'love' },
  { id: 'heart_suit', unicode: '💕', category: 'love' },
  { id: 'sparkling_heart', unicode: '💖', category: 'love' },
  { id: 'growing_heart', unicode: '💗', category: 'love' },
  { id: 'beating_heart', unicode: '💓', category: 'love' },
  { id: 'revolving_hearts', unicode: '💞', category: 'love' },
  { id: 'heart_decoration', unicode: '💘', category: 'love' },
  { id: 'heart_ribbon', unicode: '💝', category: 'love' },
  { id: 'smiling_face', unicode: '😊', category: 'faces' },
  { id: 'heart_eyes', unicode: '😍', category: 'faces' },
  { id: 'smiling_face_hearts', unicode: '🥰', category: 'faces' },
  { id: 'face_blowing_kiss', unicode: '😘', category: 'faces' },
  { id: 'pleading_face', unicode: '🥺', category: 'faces' },
  { id: 'loudly_crying', unicode: '😭', category: 'faces' },
  { id: 'rolling_laughing', unicode: '😂', category: 'faces' },
  { id: 'rolling_floor', unicode: '🤣', category: 'faces' },
  { id: 'star', unicode: '⭐', category: 'sparkles' },
  { id: 'sparkles', unicode: '✨', category: 'sparkles' },
  { id: 'glowing_star', unicode: '🌟', category: 'sparkles' },
  { id: 'dizzy', unicode: '💫', category: 'sparkles' },
  { id: 'ribbon', unicode: '🎀', category: 'sparkles' },
  { id: 'cherry_blossom', unicode: '🌸', category: 'sparkles' },
  { id: 'white_flower', unicode: '💮', category: 'sparkles' },
  { id: 'hibiscus', unicode: '🌺', category: 'sparkles' },
  { id: 'balloon', unicode: '🎈', category: 'objects' },
  { id: 'party_popper', unicode: '🎉', category: 'objects' },
  { id: 'confetti_ball', unicode: '🎊', category: 'objects' },
  { id: 'wrapped_gift', unicode: '🎁', category: 'objects' },
  { id: 'shortcake', unicode: '🍰', category: 'objects' },
  { id: 'birthday_cake', unicode: '🎂', category: 'objects' },
  { id: 'doughnut', unicode: '🍩', category: 'objects' },
  { id: 'ice_cream', unicode: '🍦', category: 'objects' },
  { id: 'cat_face', unicode: '🐱', category: 'animals' },
  { id: 'dog_face', unicode: '🐶', category: 'animals' },
  { id: 'rabbit_face', unicode: '🐰', category: 'animals' },
  { id: 'bear_face', unicode: '🐻', category: 'animals' },
  { id: 'panda_face', unicode: '🐼', category: 'animals' },
];

const MEME_STICKERS = [
  { id: 'pepe_happy', src: assetUrl('/assets/stickers/memes/pepe-happy.png'), name: 'Pepe Happy' },
  { id: 'pepe_sad', src: assetUrl('/assets/stickers/memes/pepe-sad.png'), name: 'Pepe Sad' },
  { id: 'pepe_smug', src: assetUrl('/assets/stickers/memes/pepe-smug.png'), name: 'Pepe Smug' },
  { id: 'pepe_cry', src: assetUrl('/assets/stickers/memes/pepe-cry.png'), name: 'Pepe Cry' },
  { id: 'pepe_love', src: assetUrl('/assets/stickers/memes/pepe-love.png'), name: 'Pepe Love' },
  { id: 'wojak_crying', src: assetUrl('/assets/stickers/memes/wojak-crying.png'), name: 'Wojak Crying' },
  { id: 'wojak_boomer', src: assetUrl('/assets/stickers/memes/wojak-boomer.png'), name: 'Wojak Boomer' },
  { id: 'wojak_doomer', src: assetUrl('/assets/stickers/memes/wojak-doomer.png'), name: 'Wojak Doomer' },
  { id: 'chad_yes', src: assetUrl('/assets/stickers/memes/chad-yes.png'), name: 'Chad Yes' },
  { id: 'chad_giga', src: assetUrl('/assets/stickers/memes/chad-giga.png'), name: 'Giga Chad' },
  { id: 'stonks', src: assetUrl('/assets/stickers/memes/stonks.png'), name: 'Stonks' },
  { id: 'stonks_down', src: assetUrl('/assets/stickers/memes/stonks-down.png'), name: 'Not Stonks' },
  { id: 'doge', src: assetUrl('/assets/stickers/memes/doge.png'), name: 'Doge' },
  { id: 'doge_surprise', src: assetUrl('/assets/stickers/memes/doge-surprise.png'), name: 'Doge Surprise' },
  { id: 'distracted_boyfriend', src: assetUrl('/assets/stickers/memes/distracted-boyfriend.png'), name: 'Distracted BF' },
  { id: 'drake_yes', src: assetUrl('/assets/stickers/memes/drake-yes.png'), name: 'Drake Yes' },
  { id: 'drake_no', src: assetUrl('/assets/stickers/memes/drake-no.png'), name: 'Drake No' },
  { id: 'spiderman_point', src: assetUrl('/assets/stickers/memes/spiderman-point.png'), name: 'Spiderman Point' },
  { id: 'this_is_fine', src: assetUrl('/assets/stickers/memes/this-is-fine.png'), name: 'This Is Fine' },
  { id: 'hide_pain', src: assetUrl('/assets/stickers/memes/hide-pain.png'), name: 'Hide Pain Harold' },
  { id: 'woman_yell_cat', src: assetUrl('/assets/stickers/memes/woman-yell-cat.png'), name: 'Woman Yell Cat' },
  { id: 'surprised_pikachu', src: assetUrl('/assets/stickers/memes/surprised-pikachu.png'), name: 'Surprised Pikachu' },
  { id: 'pogchamp', src: assetUrl('/assets/stickers/memes/pogchamp.png'), name: 'PogChamp' },
  { id: 'kek', src: assetUrl('/assets/stickers/memes/kek.png'), name: 'KEK' },
  { id: 'based', src: assetUrl('/assets/stickers/memes/based.png'), name: 'Based' },
  { id: 'pog', src: assetUrl('/assets/stickers/memes/pog.png'), name: 'POG' },
  { id: 'bruh', src: assetUrl('/assets/stickers/memes/bruh.png'), name: 'Bruh' },
  { id: 'skull', src: assetUrl('/assets/stickers/memes/skull.png'), name: 'Skull' },
  { id: 'fire', src: assetUrl('/assets/stickers/memes/fire.png'), name: 'Fire' },
];

export default function StickerPanel({ onStickerAdd }) {
  const [activeTab, setActiveTab] = useState('emoji');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmojis = EMOJI_STICKERS.filter(
    (sticker) =>
      sticker.unicode.includes(searchQuery) ||
      sticker.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMemes = MEME_STICKERS.filter((sticker) =>
    sticker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStickerClick = (sticker) => {
    onStickerAdd({
      ...sticker,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: 40,
      height: 40,
    });
  };

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('emoji')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
            activeTab === 'emoji'
              ? 'text-rose border-b-2 border-rose bg-rose-light/10'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span className="font-medium">Emoji</span>
        </button>
        <button
          onClick={() => setActiveTab('memes')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
            activeTab === 'memes'
              ? 'text-rose border-b-2 border-rose bg-rose-light/10'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="font-medium">Memes</span>
        </button>
      </div>

      <div className="p-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stickers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent text-sm"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {activeTab === 'emoji' && (
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerClick(sticker)}
                  className="aspect-square flex items-center justify-center text-2xl hover:bg-rose-light/30 rounded-lg transition-colors"
                  title={sticker.category}
                >
                  {sticker.unicode}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'memes' && (
            <div className="grid grid-cols-5 gap-2">
              {filteredMemes.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerClick(sticker)}
                  className="aspect-square flex items-center justify-center bg-gray-50 hover:bg-rose-light/30 rounded-lg transition-colors overflow-hidden"
                  title={sticker.name}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {activeTab === 'emoji' && filteredEmojis.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No emoji stickers found
            </p>
          )}

          {activeTab === 'memes' && filteredMemes.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No meme stickers found
            </p>
          )}
        </div>
      </div>

      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 text-center">
          Click a sticker to add it to your note
        </p>
      </div>
    </div>
  );
}
