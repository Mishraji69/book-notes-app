import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  login: async (name) => {
    return await apiClient.post('/api/login', { name });
  },

  signup: async (name) => {
    return await apiClient.post('/api/signup', { name });
  },

  // Books
  getBooks: async (userId) => {
    return await apiClient.get(`/api/books/${userId}`);
  },

  addBook: async (userId, bookName) => {
    return await apiClient.post('/api/books', { userId, bookName });
  },

  // Notes
  getNotes: async (userId, bookId) => {
    return await apiClient.get(`/api/notes/${userId}/${bookId}`);
  },

  addNote: async (userId, bookId, text, date) => {
    return await apiClient.post('/api/notes', {
      userId,
      bookId,
      notesText: text,
      shipmentDate: date,
    });
  },

  deleteNote: async (noteId, userId, bookId) => {
    return await apiClient.delete(`/api/notes/${noteId}`, {
      data: { userId, bookId },
    });
  },
};

export default apiClient;
