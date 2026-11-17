import axios from 'axios';

// This safely checks for the Vercel variable, and falls back to localhost only if you are testing on your computer
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});