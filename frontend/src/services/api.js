import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Documents API
export const documentsAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  getStats: () => api.get('/documents/stats/summary'),
};

// Smart Upload API (documents with verification)
export const smartUploadAPI = {
  upload: (formData) =>
    api.post('/smart-upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // Alias used by Documents.js (bulk upload)
  bulkUpload: (formData) =>
    api.post('/smart-upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // Detection only (no DB save)
  detectType: (formData) =>
    api.post('/smart-upload/detect-type', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // Classify + verify (optionally save)
  classifyVerify: (formData) =>
    api.post('/smart-upload/classify-verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Cases API
export const casesAPI = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  create: (data) => api.post('/cases', data),
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
  getStats: () => api.get('/cases/stats/summary'),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats/summary'),
};

// Deadlines API
export const deadlinesAPI = {
  getAll: (params) => api.get('/deadlines', { params }),
  getById: (id) => api.get(`/deadlines/${id}`),
  create: (data) => api.post('/deadlines', data),
  update: (id, data) => api.put(`/deadlines/${id}`, data),
  delete: (id) => api.delete(`/deadlines/${id}`),
  getUpcoming: () => api.get('/deadlines/upcoming/list'),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
};

export default api;

