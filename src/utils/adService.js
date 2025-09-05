/** @format */

import { api } from './api.js';

export const adService = {
  // Get all ads with search and filters
  async getAllAds(params = {}) {
    try {
      const response = await api.get('/ads', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get all ads error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch ads'
      };
    }
  },

  // Get single ad by slug
  async getAdBySlug(slug) {
    try {
      const response = await api.get(`/ads/${slug}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get ad by slug error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Ad not found'
      };
    }
  },

  // Get user's ads (requires authentication)
  async getUserAds(params = {}) {
    try {
      const response = await api.get('/ads/user/my-ads', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get user ads error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch your ads'
      };
    }
  },

  // Create new ad (requires authentication)
  async createAd(formData) {
    try {
      const response = await api.post('/ads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create ad error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create ad'
      };
    }
  },

  // Update ad (requires authentication)
  async updateAd(adId, formData) {
    try {
      const response = await api.put(`/ads/${adId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update ad error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update ad'
      };
    }
  },

  // Delete ad (requires authentication)
  async deleteAd(adId) {
    try {
      const response = await api.delete(`/ads/${adId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete ad error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete ad'
      };
    }
  },

  // Search ads with filters
  async searchAds(searchParams) {
    try {
      const response = await api.get('/ads', { params: searchParams });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Search ads error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search ads'
      };
    }
  }
};