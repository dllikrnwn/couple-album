import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, Calendar } from 'lucide-react';

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data } = await api.get('/media/approved');
      setMedia(data.media);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const openLightbox = (item) => {
    setSelectedMedia(item);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-4">Our Gallery</h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-rose text-white' 
                  : 'bg-white border border-border hover:border-rose'
              }`}
            >
              All ({media.length})
            </button>
            <button
              onClick={() => setFilter('photo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'photo' 
                  ? 'bg-rose text-white' 
                  : 'bg-white border border-border hover:border-rose'
              }`}
            >
              Photos ({media.filter(m => m.type === 'photo').length})
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'video' 
                  ? 'bg-rose text-white' 
                  : 'bg-white border border-border hover:border-rose'
              }`}
            >
              Videos ({media.filter(m => m.type === 'video').length})
            </button>
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada media di gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-0 overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(item)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.type === 'photo' ? (
                    <img
                      src={item.cloudinary_url}
                      alt={item.caption || 'Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <>
                      <video
                        src={item.cloudinary_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-12 h-12 text-white" fill="white" />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.upload_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {item.caption && (
                    <p className="text-gray-700 line-clamp-2">{item.caption}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">by {item.username}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-rose transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMedia.type === 'photo' ? (
                  <img
                    src={selectedMedia.cloudinary_url}
                    alt={selectedMedia.caption}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedMedia.cloudinary_url}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[80vh] rounded-lg"
                  />
                )}

                <div className="bg-white rounded-lg p-6 mt-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(selectedMedia.upload_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {selectedMedia.caption && (
                    <p className="text-gray-700 mb-2">{selectedMedia.caption}</p>
                  )}
                  <p className="text-sm text-gray-400">Uploaded by {selectedMedia.username}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
