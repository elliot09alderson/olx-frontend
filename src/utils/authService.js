/** @format */

import { api } from './api.js';

export const authService = {
  // Check current user authentication status
  async checkAuth() {
    try {
      const response = await api.get('/users/me');
      if (response.data.success) {
        return {
          isAuthenticated: true,
          user: {
            id: response.data.user._id,
            email: response.data.user.email,
            name: response.data.user.fullname,
            role: response.data.user.role,
          }
        };
      }
      return { isAuthenticated: false, user: null };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { isAuthenticated: false, user: null };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/users/login', credentials);
      if (response.data.success) {
        return {
          success: true,
          user: {
            id: response.data.user._id,
            email: response.data.user.email,
            name: response.data.user.fullname,
            role: response.data.user.role,
          }
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.success) {
        return {
          success: true,
          user: {
            id: response.data.user._id,
            email: response.data.user.email,
            name: response.data.user.fullname,
            role: response.data.user.role,
          }
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/users/logout');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
};