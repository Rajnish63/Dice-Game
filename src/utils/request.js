import axios from 'axios';
import URL from '../assets/constant/url';

const request = () => {
  // axios instance
  const instance = axios.create({
    baseURL: `${URL.API_BASE}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // set the token for auth
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ?? '';
    return config;
  });

  return instance;
};

export default request();
