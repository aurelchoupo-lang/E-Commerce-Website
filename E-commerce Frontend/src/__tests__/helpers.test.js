// Simple test suite for core functions
// Run with: npm test or node src/__tests__/helpers.test.js

import { 
  formatPrice, 
  formatDate, 
  formatRelativeTime, 
  truncateText, 
  isValidEmail, 
  isValidUrl,
  filterItemsBySearch,
  sortItems 
} from '../utils/helpers.js';

// Test runner
let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const assertEqual = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`${message} (got: ${actual}, expected: ${expected})`);
};

// Format Price Tests
test('formatPrice: formats USD correctly', () => {
  const result = formatPrice(100);
  assert(result.includes('100'), 'Should include price value');
  assert(result.includes('$'), 'Should include dollar sign');
});

test('formatPrice: handles decimals', () => {
  const result = formatPrice(99.99);
  assert(result.includes('99.99'), 'Should format decimals');
});

// Email Validation Tests
test('isValidEmail: accepts valid email', () => {
  assert(isValidEmail('test@example.com'), 'Valid email should pass');
});

test('isValidEmail: rejects invalid email', () => {
  assert(!isValidEmail('invalid-email'), 'Invalid email should fail');
  assert(!isValidEmail('test@'), 'Incomplete email should fail');
});

// URL Validation Tests
test('isValidUrl: accepts valid URL', () => {
  assert(isValidUrl('https://example.com/image.jpg'), 'Valid URL should pass');
});

test('isValidUrl: rejects invalid URL', () => {
  assert(!isValidUrl('not-a-url'), 'Invalid URL should fail');
  assert(!isValidUrl('ht//invalid.com'), 'Malformed URL should fail');
});

// Text Truncation Tests
test('truncateText: truncates long text', () => {
  const result = truncateText('This is a very long text that should be truncated', 20);
  assert(result.includes('...'), 'Should add ellipsis');
  assert(result.length <= 23, 'Should be within limit plus ellipsis');
});

test('truncateText: preserves short text', () => {
  const result = truncateText('Short', 20);
  assertEqual(result, 'Short', 'Short text should not be truncated');
});

// Search Filter Tests
test('filterItemsBySearch: finds by title', () => {
  const items = [
    { id: 1, title: 'iPhone', description: 'Phone', category: 'Electronics' },
    { id: 2, title: 'Desk', description: 'Furniture', category: 'Furniture' }
  ];
  const result = filterItemsBySearch(items, 'iPhone');
  assertEqual(result.length, 1, 'Should find 1 item');
});

test('filterItemsBySearch: finds by category', () => {
  const items = [
    { id: 1, title: 'iPhone', description: 'Phone', category: 'Electronics' },
    { id: 2, title: 'Desk', description: 'Furniture', category: 'Furniture' }
  ];
  const result = filterItemsBySearch(items, 'Electronics');
  assertEqual(result.length, 1, 'Should find by category');
});

// Sort Tests
test('sortItems: sorts by newest', () => {
  const items = [
    { id: 1, created_at: 1000 },
    { id: 2, created_at: 2000 },
    { id: 3, created_at: 1500 }
  ];
  const result = sortItems(items, 'newest');
  assertEqual(result[0].id, 2, 'Newest should be first');
});

test('sortItems: sorts by price low to high', () => {
  const items = [
    { id: 1, price: 100 },
    { id: 2, price: 50 },
    { id: 3, price: 75 }
  ];
  const result = sortItems(items, 'price-low');
  assertEqual(result[0].price, 50, 'Lowest price should be first');
  assertEqual(result[2].price, 100, 'Highest price should be last');
});

// Report
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
console.log(`${'='.repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
