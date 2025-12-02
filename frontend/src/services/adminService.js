import api from './api';

export const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRestaurants: async () => {
    try {
      const response = await api.get('/admin/restaurants');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      const response = await api.delete(`/admin/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};