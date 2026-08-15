import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react';

export default function ApprovalPanel() {
  const [pendingMedia, setPendingMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingMedia();
  }, []);

  const fetchPendingMedia = async () => {
    try {
      const { data } = await api.get('/media/pending');
      setPendingMedia(data.media);
    } catch (error) {
      console.error('Failed to fetch pending media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/media/${id}/status`, { status: 'approved' });
      fetchPendingMedia();
      alert('Media approved!');
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve media');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this media?')) return;
    
    try {
      await api.patch(`/media/${id}/status`, { status: 'rejected' });
      fetchPendingMedia();
      alert('Media rejected!');
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject media');
    }
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
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-2">Approval Panel</h1>
          <p className="text-gray-600">Review dan approve media dari partner</p>
        </div>

        {pendingMedia.length === 0 ? (
          <div className="card text-center py-20">
            <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Tidak ada media yang perlu di-review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMedia.map(media => (
              <div key={media.id} className="card p-0 overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  {media.type === 'photo' ? (
                    <img
                      src={media.cloudinary_url}
                      alt={media.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.cloudinary_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Pending
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(media.upload_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {media.caption && (
                      <p className="text-gray-700">{media.caption}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Uploaded by {media.username}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(media.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(media.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
