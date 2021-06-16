import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.91.91.179:3000/',
  //baseURL: 'http://184.73.130.40:3000/',
});

export default api;
