/**
 * api.js - Centralized API URL resolver for local development & cloud deployment
 * 
 * In local development:
 *   VITE_API_URL is empty -> falls back to relative '/api/...' which Vite proxies to localhost:5000.
 * 
 * In production (e.g. hosted on GitHub Pages):
 *   Set VITE_API_URL in .env.production or repository environment variables:
 *   e.g. VITE_API_URL=https://mlverse-backend.onrender.com
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://mlverse-backend.onrender.com' : '');

export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

/**
 * Resolves an endpoint to full URL
 * @param {string} endpoint - e.g. '/api/recommend'
 * @returns {string} full or relative URL
 */
export function getApiEndpoint(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}
