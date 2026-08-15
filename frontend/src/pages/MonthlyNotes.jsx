import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Calendar, Plus, Trash2, Edit2, Pencil } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';

export default function MonthlyNotes() {
  const { user, isAuthenticated } = useAuth();
  const [myNotes, setMyNotes] = useState([]);
  const [partnerNotes, setPartnerNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      if (isAuthenticated) {
        const [myRes, partnerRes] = await Promise.all([
          api.get('/notes/my-notes'),
          api.get('/notes/partner-notes')
        ]);
        
        setMyNotes(myRes.data.notes);
        setPartnerNotes(partnerRes.data.notes);
      } else {
        // Guest: Fetch unlocked notes via monthly endpoint
        const now = new Date();
        const { data } = await api.get(`/notes/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
        const unlocked = data.notes.filter(note => !note.is_locked || new Date() >= new Date(note.unlock_date));
        setPartnerNotes(unlocked);
        setMyNotes([]);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewNote = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note) => {
    if (note.is_locked && new Date() < new Date(note.unlock_date)) {
      alert('This note is locked. You cannot edit it after it has been locked.');
      return;
    }
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    const now = new Date();
    const month = editingNote?.month || now.getMonth() + 1;
    const year = editingNote?.year || now.getFullYear();

    await api.post('/notes', {
      month,
      year,
      ...noteData,
    });

    setEditorOpen(false);
    setEditingNote(null);
    fetchNotes();
    alert('Note saved! Your partner will see it at the end of the month.');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note');
    }
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-playfair font-bold mb-2">Monthly Notes</h1>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Tulis pesan rahasia yang akan terbuka di akhir bulan'
                : 'Read the beautiful notes written each month'}
            </p>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleOpenNewNote}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Write Note
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isAuthenticated && (
            <div>
              <h2 className="text-2xl font-playfair font-bold mb-4">My Notes</h2>
              {myNotes.length === 0 ? (
                <div className="card text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Belum ada note</p>
                  {isAuthenticated && (
                    <button onClick={handleOpenNewNote} className="btn-primary mt-4">
                      Write Your First Note
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {myNotes.map(note => (
                    <div key={note.id} className="relative">
                      <NoteCard 
                        note={note} 
                        showAuthor={true}
                        showLocked={true}
                      />
                      {isAuthenticated && (
                        <div className="absolute top-14 right-3 flex gap-2 z-30">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-rose-light/30 transition-colors"
                            title="Edit Note"
                          >
                            <Edit2 className="w-4 h-4 text-rose" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-red-50 transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={!isAuthenticated ? 'col-span-full' : ''}>
            <h2 className="text-2xl font-playfair font-bold mb-4">
              {isAuthenticated ? "Partner's Notes" : 'Unlocked Notes'}
            </h2>
            {partnerNotes.length === 0 ? (
              <div className="card text-center py-12">
                <Lock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Belum ada note yang terbuka</p>
              </div>
            ) : (
              <div className="space-y-4">
                {partnerNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    showAuthor={true}
                    showLocked={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setEditorOpen(false);
            setEditingNote(null);
          }}
        />
      )}
    </>
  );
}