# Marketplace — Buy & Sell Items (Frontend)

A modern, full-featured marketplace application built with **React 18**, **Tailwind CSS 3**, and **Vite**. This frontend communicates with a **Django REST API** for full data persistence. Supports bilingual UI (English & French), dark/light theme, admin panel, wishlists, and eco-responsibility indicators.

---

## ✨ Features

### Core Functionality
- **Browse Marketplace** — View all listings with rich product cards (stored in backend)
- **Search & Filter** — Real-time search, category filter, price range, condition, local/durable toggles
- **Sort** — By newest, oldest, price (low/high), or title A-Z
- **User Authentication** — Secure Register (buyer or seller) and Login via **Django Token Auth**
- **Item Management** — Create, edit, delete listings (authenticated users only)
- **Quantity Tracking** — Set and display available quantity per listing
- **Item Details** — Full product info, seller info, eco indicators, seller contact form
- **Wishlist** — Save items you want to buy
- **Ratings** — Visual star rating display per item
- **Eco Indicators** — CO₂ footprint, reparability score, local/secondhand badges
- **Admin Panel** — User management, role changes, content report handling
- **Settings** — Profile editing, password change, theme & language preferences
- **i18n** — Full English & French translations via `translations.js`
- **Dark / Light Theme** — Via `ThemeContext`
- **Responsive Design** — Mobile-first layout

### Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — browse & filter listings | No |
| `/item/:id` | Item Details | No |
| `/login` | Login | No |
| `/register` | Register (Buyer or Seller) | No |
| `/add-item` | Sell Your Item | ✅ Yes |
| `/edit-item/:id` | Edit Listing | ✅ Yes |
| `/my-listings` | My Listings | ✅ Yes |
| `/settings` | Account Settings | ✅ Yes |
| `/admin` | Admin Dashboard | ✅ Admin only |
| `/admin/users` | User Management | ✅ Admin only |
| `/admin/reports` | Reports Management | ✅ Admin only |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** and **npm**

### Installation

```bash
# Navigate to the project folder
cd "E-commerce frontend only"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build        # Output goes to dist/
npm run preview      # Test the production build locally
```

### Running Tests

```bash
npm test             # Run unit tests once
npm run test:watch   # Re-run tests on file changes
```

---

## 📁 Project Structure

Detailed overview of the frontend architecture:

- `index.html`: The HTML5 entry point. It contains the root `div` where React is mounted.
- `vite.config.js`: Configuration for the Vite build tool. It includes a proxy to bypass CORS issues by routing `/api` requests to `localhost:8000`.
- `tailwind.config.js`: Custom styling definitions, including our specific blue/green color palette and custom animations.
- `src/`:
    - `App.jsx`: The main controller of the application. It defines all routes and wraps the app in the necessary Context Providers (Theme/Language).
    - `main.jsx`: The starting script that initializes the React application and injects it into the DOM.
    - `translations.js`: A comprehensive object containing all English and French text, enabling instant language switching.
    - `pages/`: Full-page views (e.g., `Home.jsx`, `ItemDetails.jsx`). These components fetch data from the API and coordinate with smaller components.
    - `components/`: Modular, reusable UI blocks like `Navbar.jsx`, `ItemCard.jsx`, and `RatingDisplay.jsx`.
    - `services/api.js`: **The Communication Hub.** This file contains every function used to fetch, create, or update data on the Django backend.
    - `context/`: State management for preferences like Dark/Light mode and active language.
    - `utils/helpers.js`: Pure utility functions for tasks like price formatting, input sanitization, and eco-impact calculation.
    - `data/sampleItems.js`: Used as a local fallback for development or if the backend server is temporarily unreachable.
    - `__tests__/`: Automated unit tests for core utilities and business logic.

---

## 🛠️ Tech Stack

### 🗣️ Languages

| Language | Usage |
|---|---|
| **JavaScript (ES2022)** | All application logic, components, API calls, utilities |
| **JSX** | React component markup (`.jsx` files throughout `src/`) |
| **CSS** | Global base styles (`src/index.css`), Tailwind utility classes |
| **HTML5** | App shell (`index.html`), semantic structure |

### ⚛️ UI Framework & Libraries

| Library | Version | Purpose |
|---|---|---|
| **React** | 18.2 | Component-based UI framework |
| **React DOM** | 18.2 | DOM rendering for React |
| **React Router DOM** | 6.20 | Client-side routing & protected routes |

### 🎨 Styling & Design

| Tool | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.3 | Utility-first CSS framework |
| **PostCSS** | 8.4 | CSS transformation pipeline |
| **Autoprefixer** | 10.4 | Vendor prefix automation |
| **tailwind.config.js** | — | Custom palette (primary blue, secondary green), Inter font, custom animations (`fadeIn`, `slideUp`, `slideIn`), dark mode (`class` strategy) |

### ⚡ Build & Dev Tools

| Tool | Version | Purpose |
|---|---|---|
| **Vite** | 5.0 | Dev server (port 5173), HMR, production bundler |
| **@vitejs/plugin-react** | 4.2 | Vite plugin for React JSX & Fast Refresh |
| **Node.js** | 16+ | Runtime for build scripts and tests |
| **npm** | — | Package manager |
| **nodemon** | — | Dev dependency for `test:watch` script |

### 🌐 CDN Resources

| Resource | Version | Purpose |
|---|---|---|
| **Font Awesome Free** | 6.5.1 | Icon library (loaded via jsDelivr CDN) |
| **Google Fonts — Inter** | weights 300–800 | Primary typeface (loaded via Google CDN) |

### 🧪 Testing

| Tool | Purpose |
|---|---|
| **Node.js test runner** | Runs `src/__tests__/helpers.test.js` and `wishlist.test.js` directly with `node` — no extra framework required |

---

## 📖 Usage

### Register & Create a Listing
1. Open the app — you will be redirected to `/register` if not logged in
2. Choose **Buyer** or **Seller** account type and complete the form
3. Once logged in, click **Sell Item** in the navbar
4. Fill in the title, description, price, quantity, category, condition, location, and image
5. Submit — your listing appears in **My Listings**

### Browse & Search
1. The Home page shows all active listings
2. Use the **search bar** for real-time text filtering
3. Click **category buttons** to filter by category
4. Expand **Advanced Filters** for price range, condition, local, and durable toggles
5. Use the **Sort** dropdown to order results

### View Item Details
1. Click any listing card to open the full detail view
2. See description, condition, quantity, eco indicators, seller info, and ratings
3. Add to your **wishlist** or use the contact form to reach the seller

### Admin Panel
1. Log in as an admin account (seeded automatically on first run via `seedAdminIfNeeded`)
2. Navigate to **Admin** in the navbar
3. Manage users (view, change roles, delete) at `/admin/users`
4. Handle reported content at `/admin/reports`

### Settings
1. Navigate to **Settings** from the navbar
2. Update your **profile** (name, email)
3. Change your **password**
4. Set **preferences**: theme (light/dark) and language (English/Français)

---

## 🌍 Internationalisation (i18n)

All UI strings are stored in `src/translations.js`, organised by feature namespace (e.g. `nav`, `home`, `item.form`, `admin.users`). The active language is managed by `LanguageContext` and can be switched from **Settings → Preferences**.

Supported languages:
- 🇬🇧 **English** (`en`)
- 🇫🇷 **French** (`fr`)

---

## 🔐 Authentication

- Users register and login via the **Django REST API**.
- Authentication uses **DRF Token Authentication**.
- Tokens are securely stored in `localStorage` (`authToken_v1`) to persist sessions.
- Protected routes use `<ProtectedRoute>` and cross-reference with `getCurrentUserObj()`.

> **Note:** This project has been migrated from a frontend-only prototype to a full-stack application. All user data and credentials are now managed securely by the backend.

---

## 📊 Data Models

### Item

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `title` | string | Listing title |
| `description` | string | Detailed description |
| `price` | number | Price in USD |
| `quantity` | number | Available quantity |
| `category` | string | Category name |
| `image_url` | string | Image URL or base64 data URI |
| `seller_name` | string | Seller's display name |
| `seller_email` | string | Seller's contact email |
| `condition` | string | `New` · `Like New` · `Good` · `Fair` |
| `location` | string | Item location |
| `status` | string | `active` · `sold` · `archived` |
| `is_local` | boolean | Locally sourced flag |
| `co2_footprint` | number | CO₂ footprint score |
| `reparability` | number | Reparability score (0–10) |

### User

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `name` | string | Full name |
| `email` | string | Email address |
| `password` | string | Password (stored in localStorage — prototype only) |
| `role` | string | `buyer` · `seller` · `admin` |
| `created_at` | string | ISO timestamp |

---

## 📡 API Integration

`src/services/api.js` is the central service layer that communicates with the **Django REST API**.

### Key Endpoints
```
GET    /api/products/                 # List products (filters supported)
GET    /api/products/:id/             # Product details
POST   /api/products/                 # Create listing
PATCH  /api/products/:id/             # Update listing
DELETE /api/products/:id/             # Delete listing

POST   /api/login/                    # Get auth token
POST   /api/register/                 # Create user account
GET    /api/users/                    # List users (Admin)
GET    /api/reports/                  # View reported content
```

### Configuration
The frontend is configured via the `BASE_URL` constant in `api.js`. For local development, it defaults to `/api` (proxied by Vite to `http://localhost:8000`).

---

## 🎨 Customisation

### Tailwind Theme
Edit `tailwind.config.js` to adjust colors, fonts, and spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',   // Blue
        secondary: '#10B981', // Green
      }
    }
  }
}
```

### Translations
Add or edit strings in `src/translations.js`. Each language key mirrors the same namespace tree:

```javascript
export const translations = {
  en: { nav: { home: 'Home', ... }, ... },
  fr: { nav: { home: 'Accueil', ... }, ... }
};
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir dist
```

### GitHub Pages
```bash
npm run build
# Push the dist/ folder to the gh-pages branch
```

---

## 🧪 Testing

Tests live in `src/__tests__/` and run with Node directly (no extra test runner required).

```bash
npm test              # Runs helpers.test.js
npm run test:watch    # Watches for changes (requires nodemon)
```

**Coverage includes:** validation logic, filtering, sorting, formatting helpers, and wishlist operations.

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Dev server won't start | `rm -rf node_modules && npm install` |
| Styles not applying | Check `index.css` imports, clear browser cache |
| Items not loading | Check mock data in `sampleItems.js`; open DevTools console |
| Login not persisting | Verify `localStorage` is enabled in your browser |
| Admin panel not accessible | Ensure you are logged in with an account that has `role: 'admin'` |
| Images not loading | Use valid HTTPS URLs; check the image host's CORS policy |

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Font Awesome Icons](https://fontawesome.com/icons)

---

## 📝 License

**MIT** — Free to use and modify.

---

*Built with React • Vite • Tailwind CSS • React Router*
