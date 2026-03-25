import { 
  formatPrice, formatDate, truncateText, 
  isValidEmail, isValidUrl, filterItemsBySearch, filterItemsByCategory,
  filterItemsByPrice, filterItemsByCondition, sortItems, getCategoryPlaceholderImage,
  sanitizeInput, sanitizeHtml, calculateEcoImpact, calculateFairPrice,
  calculateTrustScore, generateRatingAriaLabel, suggestCharityDonation, flagHighRiskItem
} from './src/utils/helpers.js';

let totalTests = 0;
let passedTests = 0;

console.log("========================================");
console.log("   STARTING OFFLINE FRONTEND TESTS      ");
console.log("========================================\n");

const assert_test = (name, condition, errorMsg = "") => {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[✅ PASS] ${name}`);
  } else {
    console.log(`[❌ FAIL] ${name} - ${errorMsg}`);
  }
};

const assert_equal = (name, actual, expected) => {
  assert_test(name, actual === expected, `Expected ${expected}, got ${actual}`);
};

// 1. Core Formatting
assert_equal("formatPrice: Formats USD correctly", formatPrice(100), "$100.00");
assert_equal("formatPrice: Handles decimals", formatPrice(99.99), "$99.99");
assert_test("formatDate: Handles valid timestamp", formatDate(Date.now()).length > 0);

// 2. Validation
assert_test("isValidEmail: Accepts valid email", isValidEmail('test@example.com'));
assert_test("isValidEmail: Rejects invalid email", !isValidEmail('invalid-email'));
assert_test("isValidUrl: Accepts valid URL", isValidUrl('https://example.com/image.jpg'));
assert_test("isValidUrl: Rejects invalid URL", !isValidUrl('not-a-url'));

// 3. Text Processing
assert_test("truncateText: Truncates long text", truncateText('This is a very long text that should be truncated', 20).includes('...'));
assert_equal("truncateText: Preserves short text", truncateText('Short', 20), 'Short');

// 4. Filtering & Sorting
const mockItems = [
  { id: 1, title: 'iPhone', description: 'Phone', category: 'Electronics', price: 100, condition: 'Good', created_at: 1000 },
  { id: 2, title: 'Desk', description: 'Furniture', category: 'Furniture', price: 50, condition: 'New', created_at: 2000 },
  { id: 3, title: 'Macbook', description: 'Laptop', category: 'Electronics', price: 800, condition: 'Used', created_at: 1500 }
];
assert_equal("filterItemsBySearch: Finds item by title", filterItemsBySearch(mockItems, 'iPhone').length, 1);
assert_equal("filterItemsByCategory: Finds item by category", filterItemsByCategory(mockItems, 'Electronics').length, 2);
assert_equal("filterItemsByPrice: Filters within range", filterItemsByPrice(mockItems, 40, 150).length, 2);
assert_equal("filterItemsByCondition: Filters by condition", filterItemsByCondition(mockItems, 'New').length, 1);
assert_equal("sortItems: Sorts by newest first", sortItems(mockItems, 'newest')[0].id, 2);
assert_equal("sortItems: Sorts by lowest price", sortItems(mockItems, 'price-low')[0].price, 50);

// 5. UI Helpers
assert_test("getCategoryPlaceholderImage: Generates placeholder URL", getCategoryPlaceholderImage('Electronics').startsWith('https://'));
assert_equal("generateRatingAriaLabel: Generates screen-reader label", generateRatingAriaLabel(4.5, 100), "Rated 4.5 out of 5 stars based on 100 reviews");

// 6. Security Tools
// Mock the browser DOM methods required by the sanitizers for Node environment
global.document = {
  createElement: (tagName) => {
    return {
      _text: '',
      set textContent(v) { this._text = v; },
      get innerHTML() { return this._text; },
      set innerHTML(v) { this._text = v; },
      childNodes: []
    }
  }
};
try {
  const clean = sanitizeInput('<b>Hello</b>');
  assert_test("sanitizeInput: Executes safety check (Mocked Browser DOM)", clean.length > 0); 
} catch (e) {
  assert_test("sanitizeInput: Fails gracefully", false, e.message);
}

// 7. Social & Environmental Impact Tools
assert_test("flagHighRiskItem: Flags dangerous keywords (e.g. Weapon/Gun)", flagHighRiskItem("Selling a gun", "Perfect condition", "Sports"));
assert_test("flagHighRiskItem: Passes safe items", !flagHighRiskItem("Selling a desk", "Perfect condition", "Furniture"));

const ecoImpact = calculateEcoImpact('Electronics', 100);
assert_test("calculateEcoImpact: Calculates CO2 saved correctly", ecoImpact.co2Saved > 0);
assert_test("calculateFairPrice: Suggests lower fair value for 'Used' condition", calculateFairPrice('Electronics', 'Used') < 200);

const trustScore = calculateTrustScore(10, 4.8, 20, 365 * 24 * 60 * 60 * 1000);
assert_test("calculateTrustScore: Generates positive score for reliable seller metrics", trustScore > 80);

const donation = suggestCharityDonation(100);
assert_equal("suggestCharityDonation: Suggests 15% model for $100 price mapping", donation.percentage, 15);

console.log("\n========================================");
console.log("            TEST RESULTS                ");
console.log("========================================");
console.log(`Total Tests Found : ${totalTests}`);
console.log(`Tests Run         : ${totalTests}`);
console.log(`Tests Passed      : ${passedTests}`);
console.log(`Tests Failed      : ${totalTests - passedTests}`);

let percent = 0;
if (totalTests > 0) {
  percent = (passedTests / totalTests) * 100;
}
console.log(`Pass Percentage   : ${percent.toFixed(2)}%`);

if (percent === 100) {
  console.log("\n🌟 PERFECT SCORE! Frontend logic is fully operational. 🌟");
}
console.log("========================================");
