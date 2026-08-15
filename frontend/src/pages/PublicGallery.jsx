import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { Heart, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicGallery() {
  const { token } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPublicGallery();
  }, [token]);

  const fetchPublicGallery = async () => {
    try {
      const { data } = await api.get(`/settings/public/${token}`);
      setMedia(data.media);
    } catch (error) {
      console.error('Failed to fetch public gallery:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-playfair font-bold text-gray-700 mb-2">
            Gallery Not Found
          </h1>
          <p className="text-gray-500">Invalid or expired gallery link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose mr-3" fill="currentColor" />
            <h1 className="text-3xl font-playfair font-bold">Our Moments</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            A collection of our beautiful memories together
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {media.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No public media yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {item.type === 'photo' ? (
                    <img
                      src={item.cloudinary_url}
                      alt={item.caption || 'Photo'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.cloudinary_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.upload_date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {item.caption && (
                    <p className="text-gray-700">{item.caption}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Heart className="w-6 h-6 mx-auto text-rose mb-2" fill="currentColor" />
          <p className="text-gray-600 text-sm">Made with love</p>
        </div>
      </div>
    </div>
  );
}
