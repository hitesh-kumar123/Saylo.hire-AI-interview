/**
 * Authentication debugging helper
 * This file contains utilities to help debug authentication issues
 */

import axios from 'axios';

/**
 * Test authentication by validating the current token
 * Call this from browser console: import('/src/utils/authHelper.js').then(m => m.testAuth())
 */
export const testAuth = async () => {
  try {
    console.log('Testing authentication...');
    
    // Check if token exists in localStorage
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    console.log('Access token exists:', !!token);
    console.log('Refresh token exists:', !!refreshToken);
    
    if (!token) {
      console.error('No access token found in localStorage');
      return false;
    }
    
    // Test the token by making a request to /api/auth/me
    console.log('Testing access token...');
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Authentication successful:', response.data);
      return true;
    } catch (err) {
      console.error('Access token validation failed:', err);
      
      // If access token failed, try refresh token
      if (refreshToken) {
        console.log('Testing refresh token...');
        try {
          const refreshResponse = await axios.post('/api/auth/refresh', {}, {
            headers: { 'Authorization': `Bearer ${refreshToken}` }
          });
          console.log('Refresh successful:', refreshResponse.data);
          
          // Update tokens
          const newToken = refreshResponse.data.access_token;
          localStorage.setItem('access_token', newToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          
          console.log('Token refreshed and updated');
          return true;
        } catch (refreshErr) {
          console.error('Refresh token validation failed:', refreshErr);
          return false;
        }
      }
      
      return false;
    }
  } catch (error) {
    console.error('Authentication test failed:', error);
    return false;
  }
};

/**
 * Manually set authentication tokens
 * Call this from browser console: import('/src/utils/authHelper.js').then(m => m.setTokens('your-access-token', 'your-refresh-token'))
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    console.log('Access token set');
  }
  
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
    console.log('Refresh token set');
  }
  
  return { accessToken, refreshToken };
};

/**
 * Clear authentication tokens
 * Call this from browser console: import('/src/utils/authHelper.js').then(m => m.clearTokens())
 */
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete axios.defaults.headers.common['Authorization'];
  console.log('Tokens cleared');
  return true;
}; 