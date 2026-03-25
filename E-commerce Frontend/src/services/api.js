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
    if (!response.ok) throw new Error('Failed to fetch items');
    const json = await response.json();
    
    if (json.results && Array.isArray(json.results)) {
      return { data: json.results, total: json.count || json.results.length };
    }
    return { data: json, total: json.length };
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
    if (!response.ok) throw new Error('Failed to fetch item');
    return await response.json();
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
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
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
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error) || 'Failed to create item');
    }
    return await response.json();
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
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error) || 'Failed to update item');
    }
    return await response.json();
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
    if (!response.ok) throw new Error('Failed to fetch categories');
    const json = await response.json();
    return Array.isArray(json) ? json : (json.data || []);
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
    
    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit review');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getSellerReviews = async (sellerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/?seller__email=${encodeURIComponent(sellerEmail)}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const data = await response.json();
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
    if (!response.ok) throw new Error('Failed to report item');
    const data = await response.json();
    return { success: true, reportId: data.id };
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
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error) || 'Registration failed');
  }
  
  const data = await response.json();
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
  
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  
  const data = await response.json();
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
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    const data = await response.json();
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
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return await response.json();
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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.email ? errorData.email[0] : 'Failed to update profile');
    }
    const updatedBackendUser = await response.json();
    
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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.old_password ? errorData.old_password[0] : errorData.new_password ? errorData.new_password[0] : 'Failed to change password');
    }
    return { success: true, message: 'Password changed successfully' };
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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.password ? errorData.password[0] : 'Failed to delete account');
    }

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
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
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
    if (!response.ok) throw new Error('Failed to update user role');
    return await response.json();
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
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
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
