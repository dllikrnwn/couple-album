import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Upload as UploadIcon, Image, AlertCircle, CheckCircle } from 'lucide-react';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // Step 1: Upload file langsung ke Cloudinary (unsigned preset) - bypass body limit
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary config missing in .env (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
      }

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', UPLOAD_PRESET);
      uploadData.append('cloud_name', CLOUD_NAME);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: uploadData }
      );
      if (!uploadRes.ok) throw new Error('Upload ke Cloudinary gagal');
      const uploaded = await uploadRes.json();

      // Step 2: Kirim metadata (url/publicId) ke backend untuk disimpan di database
      const type = file.type.startsWith('video') ? 'video' : 'photo';
      const { data } = await api.post('/media/upload', {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        type,
        caption,
        location,
        uploadDate,
        isPublic,
      });

      setMessage({ 
        type: 'success', 
        text: 'Media uploaded and approved successfully!'
      });
      
      // Reset form
      setFile(null);
      setPreview(null);
      setCaption('');
      setLocation('');
      setUploadDate(new Date().toISOString().split('T')[0]);
      setIsPublic(true);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold mb-2">Upload Media</h1>
          <p className="text-gray-600">
            Upload foto atau video dengan lokasi dan tanggal
          </p>
        </div>

        {message.text && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Photo or Video</label>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-rose transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              
              {preview ? (
                <div className="relative">
                  {file?.type.startsWith('video') ? (
                    <video src={preview} controls className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="file-input" className="cursor-pointer">
                  <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">JPG, PNG, GIF, MP4, MOV (max 100MB)</p>
                </label>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Ceritakan tentang momen ini..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="e.g., Ancol Beach, Jakarta"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Dimana foto/video ini diambil?
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              📅 Pilih tanggal kapan foto/video ini diambil
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-rose border-gray-300 rounded focus:ring-rose"
              />
              <span className="ml-2 text-sm">Make this public in gallery</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </>
  );
}
