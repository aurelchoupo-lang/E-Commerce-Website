// RESTful Table API Service Layer

const BASE_URL = '/api';

// Helper for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken_v1');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
};

/**
 * Centrally handle fetch responses to prevent "Unexpected end of JSON input"
 * and provide better error reporting.
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // For successful empty responses (e.g. 204 No Content)
  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    const text = await response.text();
    // If response is empty, return null or empty object based on status
    if (!text) {
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} with no body`);
      }
      return null;
    }
    
    // Attempt to parse text as JSON
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
      }
      // If it's 200 but not JSON, maybe it's just a string message
      return text;
    }
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error(`Invalid JSON response from server (Status ${response.status})`);
    }
    throw error;
  }

  if (!response.ok) {
    // If data is an object with errors, stringify it
    const errorMsg = typeof data === 'object' ? JSON.stringify(data) : (data || `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
};

// Helper to paginate mock data (kept for fallback if needed)
const paginate = (arr, page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  const data = arr.slice(start, start + limit);
  return { data, total: arr.length };
};

/**
 * Get all items with optional pagination and filtering
 */
export const getItems = async (page = 1, limit = 12, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters });
    const url = `${BASE_URL}/products/?${params.toString()}`;
    const response = await fetch(url);
    const json = await handleResponse(response);
    
    if (json && json.results && Array.isArray(json.results)) {
      return { data: json.results, total: json.count || json.results.length };
    }
    return { data: json || [], total: (json && json.length) || 0 };
  } catch (error) {
    console.error('Error fetching items from backend:', error);
    return { data: [], total: 0 };
  }
};

/**
 * Get a single item by ID
 */
export const getItemById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}/`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching item from backend:', error);
    throw error;
  }
};

// Contact admin (server-backed when available, otherwise fallback)
export const contactAdmin = async ({ name, email, subject, message }) => {
  // Attempt to post to configurable endpoint first (Vite env), otherwise fallback to internal mock storage
  const endpoint = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_CONTACT_ENDPOINT : undefined;
  try {
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, created_at: Date.now() }),
      });
      return await handleResponse(response);
    }

    // No external endpoint configured — simulate success by storing locally
    const messages = JSON.parse(localStorage.getItem('contact_messages_v1') || '[]');
    messages.push({ id: `msg-${Date.now()}`, name, email, subject, message, created_at: Date.now() });
    localStorage.setItem('contact_messages_v1', JSON.stringify(messages));
    return { success: true };
  } catch (error) {
    console.warn('Contact admin endpoint failed — storing locally:', error.message);
    const messages = JSON.parse(localStorage.getItem('contact_messages_v1') || '[]');
    messages.push({ id: `msg-${Date.now()}`, name, email, subject, message, created_at: Date.now() });
    localStorage.setItem('contact_messages_v1', JSON.stringify(messages));
    return { success: true };
  }
};

/**
 * Create a new item
 */
export const createItem = async (itemData) => {
  try {
    const payload = {
      title: itemData.title,
      description: itemData.description,
      price: parseFloat(itemData.price),
      category: itemData.category,
      condition: itemData.condition || 'Good',
      location: itemData.location || '',
      stock: parseInt(itemData.quantity) || 1,
    };

    if (itemData.image_url && itemData.image_url.startsWith('data:')) {
      payload.image = itemData.image_url;
    }

    const response = await fetch(`${BASE_URL}/products/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Update an existing item
 */
export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      method: 'PATCH', // Prefer PATCH for partial updates
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...itemData,
        stock: itemData.quantity,
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

/**
 * Delete an item
 */
export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories/?limit=100`);
    const json = await handleResponse(response);
    if (!json) return getDefaultCategories();
    // Support both direct array and paginated results
    return Array.isArray(json) ? json : (json.results || json.data || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories if fetch fails
    return getDefaultCategories();
  }
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * RATINGS: Submit a seller review
 */
/**
 * RATINGS: Submit a seller review
 */
export const submitSellerReview = async (sellerId, { rating, comment }) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        seller: sellerId,
        rating,
        comment,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getSellerReviews = async (sellerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/?seller__email=${encodeURIComponent(sellerEmail)}`);
    const data = await handleResponse(response);
    if (!data) return [];
    return data.results || data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getSellerRating = async (sellerEmail) => {
  try {
    const reviews = await getSellerReviews(sellerEmail);
    const total = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) : 0;
    const avgRating = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;
    
    return {
      email: sellerEmail,
      rating: parseFloat(avgRating),
      reviewCount: reviews.length,
      reviews: reviews, // Backend returns array of review objects
      // These will be N/A or default until we have a way to fetch seller detail by email
      name: 'Seller', 
      listingCount: 0,
      accountAge: Date.now()
    };
  } catch (error) {
    console.error('Error getting seller rating:', error);
    return {
      email: sellerEmail,
      name: 'Seller',
      rating: 0,
      reviewCount: 0,
      listingCount: 0,
      accountAge: Date.now(),
      reviews: []
    };
  }
};

/**
 * FLAG: Report dangerous or suspicious items
 */
export const reportItem = async (itemId, reason, description) => {
  try {
    const response = await fetch(`${BASE_URL}/reports/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product: itemId,
        reason,
        description: description.substring(0, 1000),
      }),
    });
    const data = await handleResponse(response);
    return { success: true, reportId: data?.id };
  } catch (error) {
    console.error('Error reporting item:', error);
    throw error;
  }
};

// Mock user management (client-side only)
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('currentUser_v1');
    if (!raw) return 'Guest User';
    const obj = JSON.parse(raw);
    return obj.name || 'Guest User';
  } catch {
    return localStorage.getItem('currentUser') || 'Guest User';
  }
};

export const getCurrentUserEmail = () => {
  try {
    const raw = localStorage.getItem('currentUser_v1');
    if (!raw) return 'guest@example.com';
    const obj = JSON.parse(raw);
    return obj.email || 'guest@example.com';
  } catch {
    return localStorage.getItem('currentUserEmail') || 'guest@example.com';
  }
};

export const setCurrentUser = (name, email) => {
  // keep backward compatibility
  localStorage.setItem('currentUser', name);
  localStorage.setItem('currentUserEmail', email);
  const obj = { id: `user-${Date.now()}`, name, email, role: 'buyer' };
  localStorage.setItem('currentUser_v1', JSON.stringify(obj));
};

export const logout = () => {
  localStorage.removeItem('currentUser_v1');
  localStorage.removeItem('authToken_v1');
  // keep backward compatibility
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserEmail');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken_v1');
};

// Async register & authenticate that perform client-side password hashing
// Async register & authenticate using backend
export const registerUserAsync = async ({ name, email, password, role = 'buyer' }) => {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: email, // use email as username
      email,
      password,
      role,
      full_name: name
    }),
  });
  
  const data = await handleResponse(response);
  localStorage.setItem('authToken_v1', data.token);
  const userObj = {
    id: data.user.id,
    name: data.user.profile.full_name || data.user.username,
    email: data.user.email,
    role: data.user.profile.role,
  };
  localStorage.setItem('currentUser_v1', JSON.stringify(userObj));
  return userObj;
};

export const authenticateUserAsync = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  
  const data = await handleResponse(response);
  localStorage.setItem('authToken_v1', data.token);
  const userObj = {
    id: data.user.id,
    name: data.user.profile.full_name || data.user.username,
    email: data.user.email,
    role: data.user.profile.role,
  };
  localStorage.setItem('currentUser_v1', JSON.stringify(userObj));
  return userObj;
};

export const getCurrentUserObj = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser_v1')) || null;
  } catch {
    return null;
  }
};

// wishlist management per user email
// wishlist management using backend
export const getWishlist = async () => {
  try {
    const response = await fetch(`${BASE_URL}/wishlist/`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    if (!data) return [];
    // Return array of item IDs for compatibility or full objects? 
    // Let's return the full objects but provide a way to get IDs.
    return data.results || data; 
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const addToWishlist = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/wishlist/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product: itemId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (wishlistEntryId) => {
  try {
    const response = await fetch(`${BASE_URL}/wishlist/${wishlistEntryId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const seedAdminIfNeeded = async () => {
  // This function now relies on the backend for user management.
  // It should be removed or updated to interact with the backend's user creation.
  // For now, it's commented out as it's no longer compatible with backend-only user management.
  /*
  const users = getUsers(); // This would be the backend getUsers
  if (users.length === 0) {
    const hashed = await hashPassword('admin'); // hashPassword is removed
    const admin = { 
      id: 'admin-1', 
      name: 'Administrator', 
      email: 'admin@cyphersentry.com', 
      password: hashed,
      role: 'admin',
      accountCreated: 1710374400000 // March 14, 2024
    };
    users.push(admin);
    saveUsers(users); // saveUsers is removed
    console.info('Admin account seeded. Login with admin@cyphersentry.com / admin');
  }
  */
};

// Default categories
export const getDefaultCategories = () => [
  { id: '1', name: 'Electronics', description: 'Computers, phones, gadgets', icon: 'fa-laptop' },
  { id: '2', name: 'Furniture', description: 'Home and office furniture', icon: 'fa-couch' },
  { id: '3', name: 'Vehicles', description: 'Cars, motorcycles, bikes', icon: 'fa-car' },
  { id: '4', name: 'Clothing', description: 'Fashion and accessories', icon: 'fa-shirt' },
  { id: '5', name: 'Books', description: 'Books and magazines', icon: 'fa-book' },
  { id: '6', name: 'Sports', description: 'Sports equipment', icon: 'fa-basketball' },
  { id: '7', name: 'Toys', description: 'Toys and games', icon: 'fa-gamepad' },
  { id: '8', name: 'Home & Garden', description: 'Home decor and garden tools', icon: 'fa-home' },
];

// User profile management functions (now backend-driven)
export const updateUserProfile = async ({ name, email }) => {
  const currentUser = getCurrentUserObj();
  if (!currentUser) throw new Error('No user logged in');

  try {
    const response = await fetch(`${BASE_URL}/users/${currentUser.id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email,
        profile: { full_name: name }
      }),
    });
    const updatedBackendUser = await handleResponse(response);
    
    const updatedUser = {
      ...currentUser,
      name: updatedBackendUser.profile.full_name || updatedBackendUser.username,
      email: updatedBackendUser.email,
    };
    localStorage.setItem('currentUser_v1', JSON.stringify(updatedUser));
    // Keep backward compatibility for older components
    localStorage.setItem('currentUser', updatedUser.name);
    localStorage.setItem('currentUserEmail', updatedUser.email);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const currentUser = getCurrentUserObj();
  if (!currentUser) throw new Error('No user logged in');

  try {
    const response = await fetch(`${BASE_URL}/change-password/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        old_password: currentPassword,
        new_password: newPassword,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const deleteAccount = async ({ password }) => {
  const currentUser = getCurrentUserObj();
  if (!currentUser) throw new Error('No user logged in');

  try {
    const response = await fetch(`${BASE_URL}/delete-account/`, {
      method: 'POST', // Or DELETE, depending on backend implementation
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
    return await handleResponse(response);

    logout(); // Clear all user-related data
    // Clear wishlist and other user data (if not handled by backend on delete)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('wishlist_') || key.startsWith('ratings_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// User management (Admin only)
export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    if (!data) return [];
    return data.results || data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        profile: { role: newRole }
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getAllItems = async () => {
  const response = await getItems(1, 1000);
  return response.data;
};

export const getReports = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reports/`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    if (!data) return [];
    return data.results || data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const updateReportStatus = async (reportId, status, adminNote = '') => {
  try {
    const response = await fetch(`${BASE_URL}/reports/${reportId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        admin_note: adminNote,
        resolved_at: (status === 'resolved' || status === 'dismissed') ? new Date().toISOString() : null
      }),
    });
    if (!response.ok) throw new Error('Failed to update report status');
    return { success: true, message: 'Report status updated successfully' };
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

export const deleteItemAdmin = async (itemId) => {
  return await deleteItem(itemId);
};
