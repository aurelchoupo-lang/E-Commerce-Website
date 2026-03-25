// Utility helper functions

/**
 * Format price with currency
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format date
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format relative time
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get condition badge class
 */
export const getConditionBadge = (condition) => {
  const badges = {
    'New': 'badge-success',
    'Like New': 'badge-info',
    'Good': 'badge-warning',
    'Fair': 'badge-danger',
  };
  return badges[condition] || 'badge-info';
};

/**
 * Get status badge class
 */
export const getStatusBadge = (status) => {
  const badges = {
    'active': 'badge-success',
    'sold': 'badge-danger',
    'archived': 'badge-warning',
  };
  return badges[status] || 'badge-info';
};

/**
 * Filter items by search query
 */
export const filterItemsBySearch = (items, query) => {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter items by category
 */
export const filterItemsByCategory = (items, category) => {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
};

/**
 * Filter items by price range
 */
export const filterItemsByPrice = (items, minPrice, maxPrice) => {
  return items.filter(item => {
    const price = parseFloat(item.price);
    if (minPrice && price < minPrice) return false;
    if (maxPrice && price > maxPrice) return false;
    return true;
  });
};

/**
 * Filter items by condition
 */
export const filterItemsByCondition = (items, condition) => {
  if (!condition || condition === 'all') return items;
  return items.filter(item => item.condition === condition);
};

/**
 * Sort items
 */
export const sortItems = (items, sortBy) => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.created_at - a.created_at);
    case 'oldest':
      return sorted.sort((a, b) => a.created_at - b.created_at);
    case 'price-low':
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'price-high':
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate category-based placeholder image URL
 */
export const getCategoryPlaceholderImage = (category) => {
  const categoryColors = {
    'Electronics': 'FF6B6B',
    'Furniture': '4ECDC4',
    'Vehicles': '45B7D1',
    'Clothing': 'FFA07A',
    'Books': '98D8C8',
    'Sports': 'F7DC6F',
    'Toys': 'BB8FCE',
    'Home & Garden': '85C1E2',
    'Beauty': 'F8B4D6',
    'Music': 'A8E6CF',
    'Art': 'FFD3B6',
    'Collectibles': 'FFAAA5',
  };

  const color = categoryColors[category] || '9BB0C1';
  return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(category)}`;
};

/**
 * SECURITY: Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = String(input).trim();
  return div.innerHTML;
};

/**
 * SECURITY: Sanitize HTML content (basic)
 */
export const sanitizeHtml = (html) => {
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'];
  const div = document.createElement('div');
  div.innerHTML = String(html).trim();
  
  const walk = (node) => {
    const nodesToRemove = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === 1) { // Element node
        if (!allowedTags.includes(child.nodeName.toLowerCase())) {
          nodesToRemove.push(child);
        } else if (child.nodeName.toLowerCase() === 'a') {
          if (!child.href.startsWith('http')) child.href = '#';
        }
        walk(child);
      }
    }
    nodesToRemove.forEach(node => node.parentNode.removeChild(node));
  };
  
  walk(div);
  return div.innerHTML;
};

/**
 * SUSTAINABILITY: Calculate environmental impact of secondhand purchase
 * Returns CO2 saved and waste diverted in kg
 */
export const calculateEcoImpact = (category, price) => {
  const categoryImpact = {
    'Electronics': { co2: 15, waste: 2.5 }, // kg CO2, kg waste diverted
    'Furniture': { co2: 25, waste: 8 },
    'Clothing': { co2: 3, waste: 0.5 },
    'Books': { co2: 1, waste: 0.2 },
    'Vehicles': { co2: 100, waste: 30 },
    'Sports': { co2: 2, waste: 0.3 },
    'Toys': { co2: 1.5, waste: 0.4 },
    'Home & Garden': { co2: 8, waste: 2 },
    'Beauty': { co2: 0.5, waste: 0.1 },
    'Music': { co2: 2, waste: 0.5 },
    'Art': { co2: 1, waste: 0.2 },
    'Collectibles': { co2: 1, waste: 0.1 }
  };
  
  const base = categoryImpact[category] || { co2: 5, waste: 1 };
  const priceMultiplier = Math.min(price / 100, 2); // Cap at 2x for high-price items
  
  return {
    co2Saved: (base.co2 * priceMultiplier).toFixed(2),
    wasteDiverted: (base.waste * priceMultiplier).toFixed(2),
    treesEquivalent: ((base.co2 * priceMultiplier) / 21).toFixed(2), // Average tree absorbs ~21kg CO2/year
  };
};

/**
 * IMPACT: Calculate fair value and detect overpricing
 */
export const calculateFairPrice = (category, condition) => {
  const basePrices = {
    'Electronics': 200,
    'Furniture': 150,
    'Vehicles': 5000,
    'Clothing': 50,
    'Books': 20,
    'Sports': 80,
    'Toys': 40,
    'Home & Garden': 60,
    'Beauty': 30,
    'Music': 100,
    'Art': 100,
    'Collectibles': 150,
  };
  
  const conditionMultiplier = {
    'Like New': 0.85,
    'Good': 0.65,
    'Used': 0.45,
    'For Parts': 0.25,
  };
  
  const base = basePrices[category] || 100;
  const multiplier = conditionMultiplier[condition] || 0.5;
  return Math.round(base * multiplier);
};

/**
 * TRUST: Assess user trust score (0-100)
 */
export const calculateTrustScore = (listings, avgRating, reviewCount, accountAge) => {
  let score = 50; // Base score
  
  // Listings quality
  if (listings >= 10) score += 15;
  else if (listings >= 5) score += 10;
  else if (listings > 0) score += 5;
  
  // Reviews
  if (reviewCount >= 10 && avgRating >= 4.5) score += 20;
  else if (reviewCount >= 5 && avgRating >= 4) score += 15;
  else if (reviewCount > 0) score += 10;
  
  // Account age (in days)
  const ageInDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
  if (ageInDays >= 365) score += 15;
  else if (ageInDays >= 180) score += 10;
  else if (ageInDays >= 30) score += 5;
  
  return Math.min(score, 100);
};

/**
 * ACCESSIBILITY: Generate accessible rating display
 */
export const generateRatingAriaLabel = (rating, count) => {
  return `Rated ${rating.toFixed(1)} out of 5 stars based on ${count} reviews`;
};

/**
 * SOCIAL: Suggest donation percentage based on price
 */
export const suggestCharityDonation = (price) => {
  if (price < 10) return { percentage: 5, amount: (price * 0.05).toFixed(2) };
  if (price < 50) return { percentage: 10, amount: (price * 0.10).toFixed(2) };
  if (price < 200) return { percentage: 15, amount: (price * 0.15).toFixed(2) };
  return { percentage: 20, amount: (price * 0.20).toFixed(2) };
};

/**
 * IMPACT: Flag potentially dangerous items for review
 */
export const flagHighRiskItem = (title, description, category) => {
  const dangerous = ['weapon', 'gun', 'explosive', 'drug', 'fake', 'counterfeit', 'stolen'];
  const combined = `${title} ${description}`.toLowerCase();
  
  return dangerous.some(keyword => combined.includes(keyword));
};

