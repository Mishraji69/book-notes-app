import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FaArrowLeft, FaPlus, FaTrash, FaStickyNote, FaCalendar } from 'react-icons/fa';
import '../styles/Notes.css';

function Notes() {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState([]);
  const [bookName, setBookName] = useState('');
  const [newNote, setNewNote] = useState({ text: '', date: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [bookId]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await api.getNotes(user.userId, bookId);
      setNotes(response.data.notes);
      setBookName(response.data.bookName);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.text.trim() || !newNote.date) return;

    try {
      await api.addNote(user.userId, bookId, newNote.text, newNote.date);
      setNewNote({ text: '', date: '' });
      setShowAddNote(false);
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.deleteNote(noteId, user.userId, bookId);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="notes-container">
      {/* Header */}
      <header className="notes-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <FaArrowLeft />
            Back to Library
          </button>
          <div className="book-title-section">
            <h1>{bookName}</h1>
            <p>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className="add-note-button"
          >
            <FaPlus />
            New Note
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="notes-main">
        <div className="notes-content">
          {/* Add Note Form */}
          {showAddNote && (
            <div className="add-note-card">
              <h3>Create New Note</h3>
              <form onSubmit={handleAddNote} className="add-note-form">
                <div className="form-group">
                  <label>
                    <FaStickyNote />
                    Note Content
                  </label>
                  <textarea
                    value={newNote.text}
                    onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                    placeholder="Write your thoughts, insights, or quotes..."
                    rows="6"
                    className="note-textarea"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaCalendar />
                    Date
                  </label>
                  <input
                    type="date"
                    value={newNote.date}
                    onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                    className="note-date-input"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Save Note
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddNote(false);
                      setNewNote({ text: '', date: '' });
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <FaStickyNote className="empty-icon" />
              <h2>No notes yet</h2>
              <p>Start capturing your thoughts and insights from this book</p>
              <button
                onClick={() => setShowAddNote(true)}
                className="empty-action-button"
              >
                <FaPlus />
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note, index) => (
                <div
                  key={note.notes_id}
                  className="note-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="note-header">
                    <span className="note-date">
                      <FaCalendar />
                      {formatDate(note.shipment_date)}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.notes_id)}
                      className="delete-note-button"
                      title="Delete note"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="note-content">
                    <p>{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notes;
