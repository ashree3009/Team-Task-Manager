import axios from 'react';

// Using a module default import to handle the fact that we installed axios
import axiosDefault from 'axios';

const api = axiosDefault.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
