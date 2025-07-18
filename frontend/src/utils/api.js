import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  registerUser: (data) => api.post('/auth/register/user', data),
  registerWorker: (data) => api.post('/auth/register/worker', data),
  getProfile: () => api.get('/auth/me'),
};

// Workers API
export const workersApi = {
  getWorkers: (params) => api.get('/workers', { params }),
  getWorker: (id) => api.get(`/workers/${id}`),
  getAvailableWorkers: (service, params) => api.get(`/workers/available/${service}`, { params }),
  updateProfile: (data) => api.put('/workers/profile', data),
  updateAvailability: (data) => api.put('/workers/availability', data),
  getStats: () => api.get('/workers/dashboard/stats'),
};

// Users API
export const usersApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  saveWorker: (workerId) => api.post(`/users/save-worker/${workerId}`),
  getSavedWorkers: () => api.get('/users/saved-workers'),
  getStats: () => api.get('/users/dashboard/stats'),
  getBookingHistory: (params) => api.get('/users/booking-history', { params }),
};

// Bookings API
export const bookingsApi = {
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  acceptBooking: (id) => api.put(`/bookings/${id}/accept`),
  rejectBooking: (id, data) => api.put(`/bookings/${id}/reject`, data),
  completeBooking: (id) => api.put(`/bookings/${id}/complete`),
  cancelBooking: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  rateBooking: (id, data) => api.post(`/bookings/${id}/rate`, data),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default api;