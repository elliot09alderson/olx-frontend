/** @format */

import { api } from './api.js';

export const wishlistService = {
  // Add ad to wishlist
  async addToWishlist(adId) {
    try {
      const response = await api.post(`/wishlist/${adId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to wishlist'
      };
    }
  },

  // Remove ad from wishlist
  async removeFromWishlist(adId) {
    try {
      const response = await api.delete(`/wishlist/${adId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from wishlist'
      };
    }
  },

  // Get user's wishlist
  async getUserWishlist(params = {}) {
    try {
      const response = await api.get('/wishlist', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get wishlist error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch wishlist'
      };
    }
  },

  // Check if ad is in wishlist
  async isInWishlist(adId) {
    try {
      const response = await api.get(`/wishlist/check/${adId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Check wishlist error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check wishlist status'
      };
    }
  },

  // Get wishlist count
  async getWishlistCount() {
    try {
      const response = await api.get('/wishlist/count');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get wishlist count error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get wishlist count'
      };
    }
  },

  // Toggle wishlist status (add or remove)
  async toggleWishlist(adId, isCurrentlyInWishlist) {
    if (isCurrentlyInWishlist) {
      return await this.removeFromWishlist(adId);
    } else {
      return await this.addToWishlist(adId);
    }
  }
};