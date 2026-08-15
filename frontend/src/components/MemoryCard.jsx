import { Calendar, MapPin, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemoryCard({ media, onClick, featured = false }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`card p-0 overflow-hidden cursor-pointer group ${
        featured ? 'col-span-full' : ''
      }`}
    >
      <div className={`relative bg-gray-100 ${
        featured ? 'aspect-[21/9]' : 'aspect-square'
      }`}>
        {media.type === 'photo' ? (
          <img
            src={media.cloudinary_url}
            alt={media.caption || 'Photo'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <video
              src={media.cloudinary_url}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-12 h-12 text-white" fill="white" />
            </div>
          </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-sm line-clamp-2">{media.caption}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
          {media.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose" />
              <span className="font-medium">{media.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-rose" />
            <span>{formatDate(media.upload_date)}</span>
          </div>
        </div>
        
        {!featured && media.caption && (
          <p className="text-gray-700 text-sm line-clamp-2">{media.caption}</p>
        )}
      </div>
    </motion.div>
  );
}
