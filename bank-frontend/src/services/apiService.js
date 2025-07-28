// src/services/apiService.js
const API_BASE_URL = 'http://localhost:5089/api';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error del servidor' }));
      throw new Error(errorData.error || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};