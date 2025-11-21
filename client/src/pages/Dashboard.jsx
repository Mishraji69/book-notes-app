import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FaBook, FaPlus, FaSignOutAlt, FaSearch, FaBookOpen } from 'react-icons/fa';
import '../styles/Dashboard.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.getBooks(user.userId);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBookName.trim()) return;

    try {
      await api.addBook(user.userId, newBookName);
      setNewBookName('');
      setShowAddBook(false);
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredBooks = books.filter(book =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon-wrapper">
              <FaBook className="header-logo" />
            </div>
            <div>
              <h1>Book Notes</h1>
              <p className="user-greeting">Welcome back, {user?.userName}!</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Actions Bar */}
          <div className="actions-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className="add-book-button"
            >
              <FaPlus />
              Add Book
            </button>
          </div>

          {/* Add Book Form */}
          {showAddBook && (
            <div className="add-book-card">
              <form onSubmit={handleAddBook} className="add-book-form">
                <input
                  type="text"
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  placeholder="Enter book title..."
                  className="book-input"
                  autoFocus
                />
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Add Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBook(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Books Grid */}
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your library...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">
              <FaBookOpen className="empty-icon" />
              <h2>{searchTerm ? 'No books found' : 'Your library is empty'}</h2>
              <p>
                {searchTerm
                  ? 'Try a different search term'
                  : 'Start by adding your first book!'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddBook(true)}
                  className="empty-action-button"
                >
                  <FaPlus />
                  Add Your First Book
                </button>
              )}
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.book_id}
                  className="book-card"
                  onClick={() => navigate(`/books/${book.book_id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="book-card-header">
                    <div className="book-icon">
                      <FaBook />
                    </div>
                  </div>
                  <div className="book-card-content">
                    <h3>{book.book_name}</h3>
                    <p className="book-meta">Click to view notes</p>
                  </div>
                  <div className="book-card-footer">
                    <span className="view-notes-link">
                      Open →
                    </span>
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

export default Dashboard;
