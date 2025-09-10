// API Configuration
const API_CONFIG = {
  // Use environment variable or fallback to production URL with HTTPS
  BASE_URL: import.meta.env.VITE_API_URL || 'http://31.97.206.5:2025',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_TOKEN: '/api/verify-token',
    
    // User endpoints
    USERS: '/api/users',
    USER_PROFILE: '/api/user/profile',
    
    // Admin endpoints
    ADMIN_PROFILE: '/api/admin/profile',
    ADMIN_PROFILE_PERSONAL: '/api/admin/profile/personal',
    ADMIN_PROFILE_ADDRESS: '/api/admin/profile/address',
    ADMIN_PROFILE_PASSWORD: '/api/admin/profile/password',
    
    // Super admin endpoints
    SUPERADMIN_USERS: '/api/superadmin/users',
    SUPERADMIN_PROFILE: '/api/superadmin/profile',
    SUPERADMIN_PROFILE_PERSONAL: '/api/superadmin/profile/personal',
    SUPERADMIN_PROFILE_ADDRESS: '/api/superadmin/profile/address',
    SUPERADMIN_PROFILE_PASSWORD: '/api/superadmin/profile/password',
    SUPERADMIN_CREATE_USER: '/api/superadmin/create-user',
    SUPERADMIN_IMPERSONATE: '/api/superadmin/impersonate',
    
    // Appointments endpoints
    APPOINTMENTS: '/api/appointments',
    
    // Services endpoints
    SERVICES: '/api/services',
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for common API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
};

export default API_CONFIG;
