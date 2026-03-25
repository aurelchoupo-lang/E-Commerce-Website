# Quick Start Guide

## 📦 Installation

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## 🧪 Testing

```bash
npm test          # Run all tests
npm run test:watch  # Watch mode with nodemon
```

## 🏗️ Production Build

```bash
npm run build     # Create dist/ folder
npm run preview   # Test production build locally
```

## 📚 Project Structure

│   ├── ItemCard.jsx
│   ├── SearchBar.jsx
│   ├── CategoryFilter.jsx
│   ├── Modal.jsx
│   └── ProtectedRoute.jsx
├── services/        # API calls
│   └── api.js               # Centralized API layer with mock fallback
├── utils/           # Helper functions
│   └── helpers.js           # 14+ utilities (formatting, validation, filtering)
├── data/            # Mock data
│   └── sampleItems.js       # 12 sample items (Unsplash images)
├── __tests__/       # Unit tests
│   └── helpers.test.js      # 12 passing tests
└── index.css        # Global Tailwind + custom styles
```

## 🔑 Key Features

### Authentication
- **System**: Django REST Token Authentication.
- **Persistence**: Token stored in `localStorage` (`authToken_v1`).
- **Protected Routes**: `/add-item`, `/edit-item/:id`, `/my-listings`, `/admin`.

### API Integration
- **Location**: `src/services/api.js`.
- **Backend Required**: This frontend requires the **Django Backend** to be running on port 8000.
- **Full Setup**: See the [root README](../README.md) for instructions on starting both services.

### Styling
- **Framework**: Tailwind CSS 3
- **Font**: Inter (Google Fonts)
- **Icons**: Font Awesome 6
- **Colors**: Custom blue/green palette (see tailwind.config.js)

### Forms & Validation
- **AddItem/EditItem**: Title, price, description, category, condition, location, image URL
- **Validation**: All fields required, email format checked, URL format optional but validated

### Search & Filter
- **Search**: Real-time title + description search (case-insensitive)
- **Categories**: Electronics, Home, Fashion, Sports, Furniture, Books, Toys, Vehicles
- **Price Range**: Min/max filter with slider
- **Sort**: Newest, oldest, price low-to-high, price high-to-low, title A-Z

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides:

- **Vercel** (recommended): `vercel` → done
- **Netlify**: Git-based auto-deploy
- **GitHub Pages**: Free static hosting
- **Docker**: Custom deployment
- **Firebase**: Serverless hosting

**Fastest**: Vercel (< 2 minutes)

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { 600: '#2563eb', 700: '#1d4ed8' },  // Change blue
  secondary: { 600: '#10b981', 700: '#059669' }  // Change green
}
```

### Logo / Title
- Edit `index.html` `<title>`
- Update logo in `src/components/Navbar.jsx`

### API Endpoint
Edit `src/services/api.js`:
```javascript
const BASE_URL = 'https://your-backend-api.com/api';
```

### Mock Data
Edit `src/data/sampleItems.js` or swap with dynamic data

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Dev server won't start | `rm -rf node_modules && npm install` |
| Styles not applying | Clear browser cache (Ctrl+Shift+Delete) |
| Items not showing | Check `/src/data/sampleItems.js`, open DevTools Console |
| Login not working | Verify localStorage enabled, check browser console |
| Build fails | Check for console errors, ensure all imports have `.js` |

## 📖 Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com

## ✨ What's Included

✅ Full-featured marketplace UI  
✅ Integrated Django REST API  
✅ Real database persistence  
✅ Secure Token Authentication  
✅ CRUD operations (Products, Users, Reports, Reviews)  
✅ Search & advanced filtering  
✅ Responsive mobile & dark-mode design  

## 🎯 Next Steps

1. **Customize**: Update colors, logo, sample items
2. **Connect Backend**: Change `BASE_URL` in `src/services/api.js`
3. **Add Features**: Implement real auth, payments, notifications
4. **Deploy**: Choose platform and follow [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Monitor**: Set up error tracking (Sentry, LogRocket)

---

**Happy coding!** 🚀

For full documentation, see README.md and DEPLOYMENT.md
