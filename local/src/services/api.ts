import axios from 'axios';

const api = axios.create({
  baseURL: 'http://177.44.248.91:3333',
});

export default api;
