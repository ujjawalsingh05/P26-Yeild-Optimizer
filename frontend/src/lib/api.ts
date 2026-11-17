import axios from 'axios';

// Bypassing Vercel env variables to guarantee a clean connection
const API_URL = 'https://p26-yeild-optimizer-1.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});