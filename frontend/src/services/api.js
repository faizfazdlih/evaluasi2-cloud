import axios from 'axios';

const fallbackBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000/api`;
const envBaseUrl = process.env.REACT_APP_API_URL;
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const shouldIgnoreLocalEnv = !isLocalHost && envBaseUrl && envBaseUrl.includes('localhost');

export const API_BASE_URL = shouldIgnoreLocalEnv ? fallbackBaseUrl : (envBaseUrl || fallbackBaseUrl);
export const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile')
};

// Service Services
export const serviceService = {
  getAll: () =>
    api.get('/services'),
  getById: (id) =>
    api.get(`/services/${id}`),
  getByCategory: (category) =>
    api.get(`/services/category/${category}`),
  create: (data) =>
    api.post('/services', data),
  update: (id, data) =>
    api.put(`/services/${id}`, data),
  delete: (id) =>
    api.delete(`/services/${id}`)
};

// Application Services
export const applicationService = {
  getAll: () =>
    api.get('/applications'),
  getById: (id) =>
    api.get(`/applications/${id}`),
  getMyApplications: () =>
    api.get('/applications/my-applications'),
  create: (data) =>
    api.post('/applications', data),
  update: (id, data) =>
    api.put(`/applications/${id}`, data),
  delete: (id) =>
    api.delete(`/applications/${id}`)
};

export default api;
