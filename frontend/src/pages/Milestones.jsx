import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Calendar, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Milestones() {
  const { isAdmin } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestoneDate: '',
    photoUrl: ''
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data } = await api.get('/milestones');
      setMilestones(data.milestones);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await api.put(`/milestones/${editingId}`, formData);
      } else {
        await api.post('/milestones', formData);
      }
      
      fetchMilestones();
      resetForm();
    } catch (error) {
      console.error('Failed to save milestone:', error);
      alert('Failed to save milestone');
    }
  };

  const handleEdit = (milestone) => {
    setEditingId(milestone.id);
    setFormData({
      title: milestone.title,
      description: milestone.description || '',
      milestoneDate: milestone.milestone_date.split('T')[0],
      photoUrl: milestone.photo_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await api.delete(`/milestones/${id}`);
      fetchMilestones();
    } catch (error) {
      console.error('Failed to delete milestone:', error);
      alert('Failed to delete milestone');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      milestoneDate: '',
      photoUrl: ''
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-2">Our Milestones</h1>
            <p className="text-gray-600">Momen-momen penting dalam perjalanan kita</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Add Milestone'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-playfair font-bold mb-4">
              {editingId ? 'Edit Milestone' : 'New Milestone'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., First Date"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Tell the story..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.milestoneDate}
                  onChange={(e) => setFormData({ ...formData, milestoneDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo URL (optional)</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {milestones.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada milestone. Tambah yang pertama!</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-rose-light"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="relative pl-20">
                  <div className="absolute left-5 top-0 w-6 h-6 bg-rose rounded-full border-4 border-cream"></div>
                  
                  <div className="card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-playfair font-bold mb-1">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(milestone.milestone_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="text-gray-500 hover:text-rose transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {milestone.description && (
                      <p className="text-gray-700 mb-4">{milestone.description}</p>
                    )}
                    
                    {milestone.photo_url && (
                      <img
                        src={milestone.photo_url}
                        alt={milestone.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
