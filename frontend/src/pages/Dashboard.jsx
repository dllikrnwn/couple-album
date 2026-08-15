import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MonthSelector from '../components/MonthSelector';
import MemoryCard from '../components/MemoryCard';
import NoteCard from '../components/NoteCard';
import api from '../utils/api';
import { Heart, Calendar, Image, Video, Upload as UploadIcon, MapPin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    relationshipDays: 0,
    totalPhotos: 0,
    totalVideos: 0,
    milestones: 0
  });
  const [emailStatus, setEmailStatus] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [monthlyMedia, setMonthlyMedia] = useState([]);
  const [monthlyNotes, setMonthlyNotes] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const [loading, setLoading] = useState(true);

  const handleTestEmail = async () => {
    setSendingEmail(true);
    setEmailStatus(null);
    try {
      const { data } = await api.post('/settings/test-email');
      setEmailStatus({ type: 'success', text: 'Test email sent! Cek inbox Gmail Anda.' });
    } catch (error) {
      setEmailStatus({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to send test email' 
      });
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    fetchMonthlyMedia(selectedYear, selectedMonth);
    fetchMonthlyNotes(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const fetchDashboardData = async () => {
    try {
      const [daysRes, mediaRes, milestonesRes] = await Promise.all([
        api.get('/settings/relationship-days'),
        api.get('/media/approved'),
        api.get('/milestones')
      ]);

      const photos = mediaRes.data.media.filter(m => m.type === 'photo').length;
      const videos = mediaRes.data.media.filter(m => m.type === 'video').length;

      setStats({
        relationshipDays: daysRes.data.days,
        totalPhotos: photos,
        totalVideos: videos,
        milestones: milestonesRes.data.milestones.length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMonths = async () => {
    try {
      const { data } = await api.get('/media/available-months');
      setAvailableMonths(data.months);
    } catch (error) {
      console.error('Failed to fetch available months:', error);
    }
  };

  const fetchMonthlyMedia = async (year, month) => {
    try {
      const { data } = await api.get(`/media/monthly?year=${year}&month=${month}`);
      setMonthlyMedia(data.media);
    } catch (error) {
      console.error('Failed to fetch monthly media:', error);
      setMonthlyMedia([]);
    }
  };

  const fetchMonthlyNotes = async (year, month) => {
    try {
      const { data } = await api.get(`/notes/monthly?year=${year}&month=${month}`);
      setMonthlyNotes(data.notes);
    } catch (error) {
      console.error('Failed to fetch monthly notes:', error);
      setMonthlyNotes([]);
    }
  };

  const handleMonthChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const openLightbox = (media) => {
    setSelectedMedia(media);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const featuredPhoto = monthlyMedia.length > 0 ? monthlyMedia[0] : null;
  const gridPhotos = monthlyMedia.slice(1, 7);

  // Filter notes for guest (only show unlocked)
  const displayNotes = isAuthenticated 
    ? monthlyNotes 
    : monthlyNotes.filter(note => !note.is_locked || new Date() >= new Date(note.unlock_date));

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-playfair font-bold mb-2">
            {isAuthenticated ? `Welcome back, ${user?.username}!` : 'Our Moments'}
          </h1>
          <p className="text-gray-600">
            {isAuthenticated ? 'Selamat datang di album kenangan kita bersama' : 'A collection of our beautiful memories together'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-rose" fill="currentColor" />
            </div>
            <h3 className="text-3xl font-playfair font-bold mb-1">
              {stats.relationshipDays}
            </h3>
            <p className="text-gray-600">Days Together</p>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Image className="w-8 h-8 text-rose" />
            </div>
            <h3 className="text-3xl font-playfair font-bold mb-1">
              {stats.totalPhotos}
            </h3>
            <p className="text-gray-600">Photos</p>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Video className="w-8 h-8 text-rose" />
            </div>
            <h3 className="text-3xl font-playfair font-bold mb-1">
              {stats.totalVideos}
            </h3>
            <p className="text-gray-600">Videos</p>
          </div>

          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-rose" />
            </div>
            <h3 className="text-3xl font-playfair font-bold mb-1">
              {stats.milestones}
            </h3>
            <p className="text-gray-600">Milestones</p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-playfair font-bold mb-2">
                📅 {monthNames[selectedMonth - 1]} {selectedYear} Memories
              </h2>
              <p className="text-gray-600">
                {monthlyMedia.length} {monthlyMedia.length === 1 ? 'memory' : 'memories'} from this month
              </p>
            </div>
            
            <MonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              availableMonths={availableMonths}
            />
          </div>

          {monthlyMedia.length === 0 ? (
            <div className="card text-center py-20">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-playfair font-bold mb-2">
                No memories from {monthNames[selectedMonth - 1]} {selectedYear} yet
              </h3>
              <p className="text-gray-600 mb-6">
                {isAuthenticated ? 'Start creating memories this month!' : 'Check back later for new memories'}
              </p>
              {isAuthenticated && (
                <a href="/upload" className="btn-primary inline-flex items-center gap-2">
                  <UploadIcon className="w-4 h-4" />
                  Upload Your First Photo
                </a>
              )}
            </div>
          ) : (
            <>
              {featuredPhoto && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span>⭐</span>
                    Featured Memory
                  </h3>
                  <MemoryCard
                    media={featuredPhoto}
                    onClick={() => openLightbox(featuredPhoto)}
                    featured={true}
                  />
                </div>
              )}

              {gridPhotos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span>📸</span>
                    More from This Month
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridPhotos.map((media) => (
                      <MemoryCard
                        key={media.id}
                        media={media}
                        onClick={() => openLightbox(media)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {monthlyMedia.length > 7 && (
                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-3">
                    Showing 7 of {monthlyMedia.length} photos from {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                  <a
                    href="/gallery"
                    className="text-rose font-medium hover:underline"
                  >
                    View All {monthNames[selectedMonth - 1]} Photos →
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {displayNotes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-6">
              💌 Notes from {monthNames[selectedMonth - 1]} {selectedYear}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayNotes.map((note) => (
                <NoteCard key={note.id} note={note} showAuthor={true} />
              ))}
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-playfair font-bold">Quick Actions</h2>
              <div>
                {emailStatus && (
                  <p className={`text-sm mb-2 ${emailStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {emailStatus.text}
                  </p>
                )}
                <button
                  onClick={handleTestEmail}
                  disabled={sendingEmail}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-rose" />
                  {sendingEmail ? 'Mengirim...' : 'Kirim Test Email'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/upload"
                className="p-6 border border-border rounded-lg hover:border-rose hover:bg-rose-light/20 transition-all text-center"
              >
                <Image className="w-8 h-8 mx-auto mb-3 text-rose" />
                <h3 className="font-semibold mb-1">Upload Media</h3>
                <p className="text-sm text-gray-600">Tambah foto atau video baru</p>
              </a>

              <a
                href="/milestones"
                className="p-6 border border-border rounded-lg hover:border-rose hover:bg-rose-light/20 transition-all text-center"
              >
                <Calendar className="w-8 h-8 mx-auto mb-3 text-rose" />
                <h3 className="font-semibold mb-1">Add Milestone</h3>
                <p className="text-sm text-gray-600">Catat momen penting</p>
              </a>

              <a
                href="/notes"
                className="p-6 border border-border rounded-lg hover:border-rose hover:bg-rose-light/20 transition-all text-center"
              >
                <Heart className="w-8 h-8 mx-auto mb-3 text-rose" />
                <h3 className="font-semibold mb-1">Monthly Notes</h3>
                <p className="text-sm text-gray-600">Tulis pesan rahasia</p>
              </a>
            </div>
          </div>
        )}

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
                className="absolute top-4 right-4 text-white hover:text-rose transition-colors text-2xl"
              >
                ×
              </button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="max-w-5xl w-full"
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
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    {selectedMedia.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-rose" />
                        <span className="font-medium">{selectedMedia.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-rose" />
                      <span>
                        {new Date(selectedMedia.upload_date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
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
