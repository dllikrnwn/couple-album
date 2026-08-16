import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Lock } from 'lucide-react';

const EMOJI_GROUPS = [
  { label: 'Rayakan', emojis: ['🎉', '🎂', '🎈', '🎁', '🎊', '🏆', '🥂', '🎆'] },
  { label: 'Cinta', emojis: ['💕', '❤️', '💍', '💞', '🌹', '🥰', '😍', '💖'] },
  { label: 'Makanan', emojis: ['🍽️', '🍜', '☕', '🍕', '🍰', '🍫', '🍩', '🍷'] },
  { label: 'Aktivitas', emojis: ['✈️', '🏖️', '🌴', '🎬', '🎤', '🎢', '⛰️', '🚗'] },
  { label: 'Alam', emojis: ['🌸', '🌻', '🍁', '🌙', '⭐', '☀️', '🌈', '☔'] },
  { label: 'Lainnya', emojis: ['🎵', '📸', '🧸', '🦋', '👶', '🏠', '🐶', '🐱', '🚀', '💤'] },
];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DOW = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// ponytail: legacy rows contain corrupted emoji defaults; fall back to a clean icon
const safeEmoji = (evo) => (evo && !/^dY/.test(evo) ? evo : EMOJI_GROUPS[0].emojis[0]);

export default function CalendarPage() {
  const { user, isAuthenticated } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthEvents, setMonthEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '', emoji: EMOJI_GROUPS[0].emojis[0] });

  useEffect(() => {
    if (isAuthenticated) fetchMonth();
  }, [year, month, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && selectedDate) fetchDay(selectedDate);
  }, [selectedDate, isAuthenticated]);

  const fetchMonth = async () => {
    try {
      const { data } = await api.get(`/events/month?year=${year}&month=${month}`);
      setMonthEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch month events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDay = async (date) => {
    try {
      const { data } = await api.get(`/events?date=${date}`);
      setDayEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch day events:', error);
      setDayEvents([]);
    }
  };

  const changeMonth = (delta) => {
    setSelectedDate(null);
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m);
    setYear(y);
  };

  const dayKey = (d) => `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const eventsByDate = {};
  monthEvents.forEach((ev) => {
    const k = ev.event_date.split('T')[0];
    (eventsByDate[k] = eventsByDate[k] || []).push(ev);
  });

  const firstDay = new Date(year, month - 1, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const grid = [];
  for (let i = 0; i < startOffset; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const openAdd = (date) => {
    setEditingId(null);
    setFormData({ title: '', description: '', eventDate: date, emoji: EMOJI_GROUPS[0].emojis[0] });
    setShowForm(true);
  };

  const openEdit = (ev) => {
    setEditingId(ev.id);
    setFormData({ title: ev.title, description: ev.description || '', eventDate: ev.event_date.split('T')[0], emoji: safeEmoji(ev.emoji) });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title: formData.title, description: formData.description, eventDate: formData.eventDate, emoji: formData.emoji };
      if (editingId) await api.put(`/events/${editingId}`, payload);
      else await api.post('/events', payload);
      setShowForm(false);
      await Promise.all([fetchMonth(), fetchDay(selectedDate)]);
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Gagal menyimpan event');
    }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm('Hapus event ini?')) return;
    try {
      await api.delete(`/events/${ev.id}`);
      await Promise.all([fetchMonth(), fetchDay(selectedDate)]);
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Gagal menghapus event');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <Lock className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-playfair font-bold mb-3">Kalender Acara</h1>
          <p className="text-gray-600 mb-6">Kalender hanya bisa dilihat oleh pengguna yang sudah login.</p>
          <Link to="/login" className="btn-primary inline-block">Login</Link>
        </div>
      </>
    );
  }

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
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-2">Kalender Acara</h1>
        <p className="text-gray-600 mb-8">Momen-momen spesial kita, lengkap dengan penanda emoji</p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg border border-border hover:border-rose transition-colors" aria-label="Bulan sebelumnya">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-playfair font-bold">
              {MONTHS[month - 1]} {year}
            </h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-lg border border-border hover:border-rose transition-colors" aria-label="Bulan berikutnya">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {showForm && (
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          )}
        </div>

        {showForm && (
          <div className="card mb-8">
            <h3 className="text-xl font-playfair font-bold mb-4">
              {editingId ? 'Edit Event' : 'Event Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="mis. Anniversary pertama"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Ceritakan momennya..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emoji</label>
                <div className="space-y-3">
                  {EMOJI_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs text-gray-400 mb-1.5">{group.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.emojis.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setFormData({ ...formData, emoji: em })}
                            className={`p-1.5 rounded-lg border text-xl transition-colors ${formData.emoji === em ? 'border-rose bg-rose-light/20' : 'border-border hover:border-rose'}`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Buat Event'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DOW.map((d) => (
              <div key={d} className="text-center text-xs sm:text-sm font-medium text-gray-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) =>
              d === null ? (
                <div key={`empty-${i}`} className="h-14 sm:h-16" />
              ) : (
                <button
                  key={d}
                  onClick={() => setSelectedDate(dayKey(d))}
                  className={`h-14 sm:h-16 rounded-lg border flex flex-col items-center justify-start pt-1 transition-colors ${
                    selectedDate === dayKey(d)
                      ? 'border-rose bg-rose-light/20'
                      : dayKey(d) === todayKey
                        ? 'border-rose/40 bg-rose-light/10 hover:border-rose'
                        : 'border-border hover:border-rose'
                  }`}
                >
                  <span className={`text-sm ${selectedDate === dayKey(d) || dayKey(d) === todayKey ? 'font-semibold text-rose' : 'text-gray-700'}`}>
                    {d}
                  </span>
                  <span className="text-sm leading-tight">
                    {(eventsByDate[dayKey(d)] || []).slice(0, 3).map((ev, j) => (
                      <span key={j}>{safeEmoji(ev.emoji)}</span>
                    ))}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {selectedDate && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-playfair font-bold">
                {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => openAdd(selectedDate)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Event
              </button>
            </div>

            {dayEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Belum ada event di tanggal ini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start justify-between gap-3 p-4 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{safeEmoji(ev.emoji)}</span>
                      <div>
                        <h4 className="font-semibold">{ev.title}</h4>
                        {ev.description && <p className="text-gray-600 text-sm mt-1">{ev.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">oleh {ev.username}</p>
                      </div>
                    </div>
                    {user?.id === ev.user_id && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => openEdit(ev)} className="text-gray-500 hover:text-rose transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ev)} className="text-gray-500 hover:text-red-500 transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}