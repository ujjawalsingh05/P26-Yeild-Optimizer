import axios from 'axios';

// Ensure the URL is clean and absolute
let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Remove any accidental trailing slashes or quotes
apiUrl = apiUrl.replace(/\/+$/, '').replace(/['"]+/g, '').trim();

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});