import api from './api';

export const restaurantService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/restaurants', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (restaurantData) => {
    try {
      const response = await api.post('/restaurants', restaurantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, restaurantData) => {
    try {
      const response = await api.put(`/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMenuItems: async (restaurantId) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addMenuItem: async (restaurantId, menuItemData) => {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/menu`, menuItemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};