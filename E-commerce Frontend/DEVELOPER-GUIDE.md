# 🎯 QUICK REFERENCE: New Features & APIs

## 🔐 Security Functions

### Sanitize User Input
```javascript
import { sanitizeInput } from '../utils/helpers';

// Use in templates
<p>{sanitizeInput(userContent)}</p>

// Removes all HTML tags, prevents XSS
// Input:  "Hello <script>alert('xss')</script>"
// Output: "Hello alert('xss')"
```

### Sanitize HTML (Safe Tags)
```javascript
import { sanitizeHtml } from '../utils/helpers';

// Allows: <b>, <i>, <em>, <strong>, <a>, <p>, <br>, <ul>, <ol>, <li>
const safe = sanitizeHtml(userHtml);
// Removes: <script>, <img>, onclick, etc.
```

### Flag Dangerous Items
```javascript
import { flagHighRiskItem } from '../utils/helpers';

const isDangerous = flagHighRiskItem(title, description, category);
if (isDangerous) {
  // Block listing
  alert('This item is prohibited');
}
```

---

## 🌍 Environmental Impact

### Calculate CO₂ Saved
```javascript
import { calculateEcoImpact } from '../utils/helpers';

const impact = calculateEcoImpact('Electronics', 299);
// Returns: {
//   co2Saved: "7.50",        // kg CO₂
//   wasteDiverted: "1.25",   // kg waste
//   treesEquivalent: "0.36"  // trees/year
// }
```

### Display in UI
```jsx
// In ItemDetails.jsx
{ecoImpact && isBuyer && (
  <div className="bg-green-50 rounded-lg p-4">
    <p>CO₂ Saved: {ecoImpact.co2Saved} kg</p>
    <p>🌍 Tree Equivalent: {ecoImpact.treesEquivalent}</p>
  </div>
)}
```

---

## ⭐ Seller Ratings & Trust

### Get Seller Rating
```javascript
import { getSellerRating } from '../services/api';

const rating = await getSellerRating('seller@example.com');
// Returns: {
//   rating: 4.8,
//   reviewCount: 156,
//   listingCount: 42,
//   accountAge: 1234567890000,
//   reviews: [...]
// }
```

### Calculate Trust Score
```javascript
import { calculateTrustScore } from '../utils/helpers';

const score = calculateTrustScore(
  listings,        // number
  avgRating,       // 0-5
  reviewCount,     // number
  accountAge       // timestamp
);
// Returns: 0-100 trust score

// Interpretation:
// 80-100: Excellent ✓
// 60-79:  Good ✓
// 40-59:  Fair
// 0-39:   New
```

### Submit Review
```javascript
import { submitSellerReview } from '../services/api';

await submitSellerReview(sellerId, {
  rating: 5,
  comment: "Great seller, item as described!"
});
// Review is persisted in the Django database
// Linked to seller account via foreign key
```

### Display Rating Card
```jsx
import RatingDisplay from '../components/RatingDisplay';

<RatingDisplay 
  seller={sellerData} 
  showEcoImpact={false}
/>

// Shows: Stars, trust score, seller stats, reviews
```

---

## 🛡️ Error Handling

### Error Boundary (Automatic)
```jsx
// Wrap any component tree
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>

// If any child component crashes:
// - Displays user-friendly error page
// - Shows "Try Again" and "Go Home" buttons
// - In dev: Shows full error stack
```

### Catch Component Errors
```jsx
// Triggered automatically for:
// - Runtime errors in render
// - Errors in lifecycle methods
// - Errors in event handlers (if wrapped in try/catch)
// - Errors in constructors

// NOT caught:
// - Async errors (use .catch())
// - Event handlers (use try/catch)
// - setTimeout/setInterval
```

---

## 💰 Fair Pricing

### Calculate Fair Price
```javascript
import { calculateFairPrice } from '../utils/helpers';

const fair = calculateFairPrice('Electronics', 'Good');
// Returns: $130 (representative fair price)

// Compare user listing
if (userPrice > fair * 1.2) {
  console.warn('Price 20% above market average');
}
```

---

## 📋 Reporting & Safety

### Report Dangerous Item
```javascript
import { reportItem } from '../services/api';

await reportItem(itemId, 'counterfeit', 'Description of issue');
// Returns: { success: true }
// Stored in: Django Database (Report model)
// Admin reviews flagged items via /admin/reports
```

### Suggest Charity Donation
```javascript
import { suggestCharityDonation } from '../utils/helpers';

const donation = suggestCharityDonation(199.99);
// Returns: {
//   percentage: 15,
//   amount: "30.00"
// }

// Display: "Consider donating $30.00 to local charities"
```

---

## ♿ Accessibility

### Generate ARIA Labels
```javascript
import { generateRatingAriaLabel } from '../utils/helpers';

const label = generateRatingAriaLabel(4.8, 156);
// Returns: "Rated 4.8 out of 5 stars based on 156 reviews"

// Use in template
<div aria-label={label}>
  ⭐⭐⭐⭐ 4.8 (156 reviews)
</div>
```

---

## 🎨 Category-Based Images

### Get Placeholder by Category
```javascript
import { getCategoryPlaceholderImage } from '../utils/helpers';

const url = getCategoryPlaceholderImage('Electronics');
// Returns: "https://via.placeholder.com/400x300/FF6B6B/...?text=Electronics"

// Each category has unique color:
// Electronics: Red
// Furniture: Teal
// Vehicles: Blue
// Clothing: Coral
// ... etc
```

---

## 📝 Component Examples

### ItemDetails with All New Features
```jsx
import ItemDetails from './pages/ItemDetails';

// Auto-includes:
// ✓ RatingDisplay (seller trust score)
// ✓ Sanitized title & description
// ✓ Environmental impact card
// ✓ Eco-impact calculated from item price
// ✓ Safe HTML rendering
// ✓ Error boundary wrapper (via App.jsx)
```

### AddItem with Safety Check
```jsx
import AddItem from './pages/AddItem';

// Auto-includes:
// ✓ Input sanitization on submit
// ✓ Dangerous item detection
// ✓ Prohibited items warning
// ✓ Fair price calculation reference
// ✓ Error boundary via App.jsx
```

---

## 🧪 Testing Tips

### Test XSS Protection
```javascript
// Try to inject in title:
"<img src=x onerror='alert(1)'>"

// Result: Sanitized to safe text
"<img src=x onerror='alert(1)'>" ✓ Blocked
```

### Test Error Boundary
```javascript
// Throw error in any child component
throw new Error('Test error');

// Result: Error boundary catches,
// displays recovery page ✓
```

### Test Eco-Impact
```javascript
const impact = calculateEcoImpact('Electronics', 500);
console.log(impact);
// { 
//   co2Saved: "18.75",
//   wasteDiverted: "2.50",
//   treesEquivalent: "0.89"
// }
```

### Test Trust Score
```javascript
const score = calculateTrustScore(50, 4.8, 156, Date.now() - 365*24*60*60*1000);
console.log(score); // 87 → "Excellent"
```

---

## 🚀 Deployment Checklist

- [x] Security functions tested
- [x] Error boundary in place  
- [x] Rating display working
- [x] Eco-impact calculating
- [x] Inputs sanitized
- [x] Build succeeds (0 errors)
- [x] Components render properly
- [ ] User testing (UAT)
- [ ] Monitor error logs post-launch
- [ ] Track environmental KPIs

---

## 🔗 Related Files

| All helper functions | `src/utils/helpers.js` |
| API/Backend Service | `src/services/api.js` |
| Django Models | `E-commerce Backend/products/models.py` |
| Django Views/API | `E-commerce Backend/products/views.py` |
| Error boundary | `src/components/ErrorBoundary.jsx` |
| Rating display | `src/components/RatingDisplay.jsx` |
| Item details (integrated) | `src/pages/ItemDetails.jsx` |
| Add item (integrated) | `src/pages/AddItem.jsx` |
| Main app wrapper | `src/App.jsx` |

---

## 📞 Support

For questions on new features:
1. Check `PROJECT-IMPROVEMENTS.md` for detailed docs
2. Review inline JSDoc comments in code
3. Search function names in helpers.js
4. Check component props (RatingDisplay, ErrorBoundary)

**Happy coding! 🚀**
