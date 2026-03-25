# Deployment Guide

This frontend-only marketplace is optimized for rapid deployment. Choose your preferred hosting platform below.

## 🚀 Quick Deployment Summary

| Platform | Setup Time | Cost | Recommendation |
|----------|-----------|------|-----------------|
| **Vercel** | < 2 min | Free tier available | ⭐ Recommended for Vite |
| **Netlify** | < 2 min | Free tier available | Great alternative |
| **GitHub Pages** | < 5 min | Free | Good for side projects |
| **Docker** | 10 min | Varies | Best for custom servers |

---

## 1️⃣ Vercel (Recommended)

**Best for**: Vite projects with zero-config deployment

### Setup

```bash
# Install Vercel CLI
npm install -g vercel

# From project directory
vercel

# Follow the prompts (select "Next.js" framework or "Other" → SPA)
# Your app will be live immediately with auto-preview URLs
```

### Configuration (optional)

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite-api-url"
  }
}
```

### Environment Variables

Add via Vercel Dashboard:
```
VITE_API_URL=https://your-backend-api.com
```

### Custom Domain

In Vercel Dashboard → Settings → Domains, add your domain and update DNS.

**Cost**: Free tier includes 100 GB bandwidth/month, unlimited functions.

---

## 2️⃣ Netlify

### Setup

```bash
# Option A: Git-based deployment (recommended)
# 1. Push code to GitHub
# 2. Go to https://app.netlify.com/signup
# 3. Connect your repository
# 4. Set build command: npm run build
# 5. Set publish directory: dist
# Deploy happens automatically on push!

# Option B: Manual deployment
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir dist
```

### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Custom Domain

Add domain in Netlify Dashboard → Domain settings.

**Cost**: Free tier includes 100 GB/month bandwidth.

---

## 3️⃣ GitHub Pages

### Setup

```bash
# 1. Update vite.config.js base path if not root:
# base: '/your-repo-name/'

# 2. Build locally
npm run build

# 3. Push dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages

# 4. In GitHub repo Settings → Pages:
#    - Source: Deploy from a branch
#    - Branch: gh-pages, folder: / (root)
#    - Custom domain (optional)
```

### Using GitHub Actions (Auto-deploy)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Cost**: Free hosting (public repos).

---

## 4️⃣ Docker + Cloud Run / ECS / App Service

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build & Run Locally

```bash
# Build
docker build -t marketplace:latest .

# Run
docker run -p 3000:3000 marketplace:latest

# Push to registry
docker tag marketplace:latest your-registry/marketplace:latest
docker push your-registry/marketplace:latest
```

### Deploy to Google Cloud Run

```bash
# Requires: gcloud CLI + Cloud Run enabled
gcloud run deploy marketplace \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to AWS ECS / Fargate

```bash
# Create ECR repository
aws ecr create-repository --repository-name marketplace

# Build and push
docker build -t marketplace:latest .
docker tag marketplace:latest YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/marketplace:latest
docker push YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/marketplace:latest

# Create ECS task & service via Console or CLI
```

### Deploy to Azure App Service

```bash
# Push to ACR
az acr build --registry myregistry --image marketplace:latest .

# Deploy to App Service
az webapp create --resource-group mygroup --plan myplan \
  --name marketplace --deployment-container-image-name-user myregistry.azurecr.io/marketplace:latest
```

---

## 5️⃣ Firebase Hosting

### Setup

```bash
npm install -g firebase-tools
firebase login
firebase init hosting

# Choose:
# - Project: Create new or select existing
# - Public directory: dist
# - Configure SPA: Yes
# - Deploy: No (we'll do it manually first)
```

### Deploy

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

---

## 6️⃣ Traditional Server (Node.js)

### Option 1: PM2 on VPS/EC2

```bash
# Install PM2
npm install -g pm2

# Build
npm run build

# Start production server
pm2 start "npx serve -s dist -l 3000" --name "marketplace"
pm2 startup
pm2 save

# Logs
pm2 logs marketplace
```

### Option 2: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # SPA routing fallback
        error_page 404 =200 /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📊 Environment Configuration

### Production Variables

Update `src/services/api.js`:
```javascript
const BASE_URL = process.env.VITE_API_URL || 'https://your-production-api.com/api';
```

### Build-time Environment

In `.env.production`:
```
VITE_API_URL=https://your-production-api.com/api
VITE_APP_NAME=Marketplace
```

Build with:
```bash
npm run build
```

---

## 🔒 Security Checklist

- [ ] Remove sensitive credentials from code (use environment variables)
- [ ] Enable HTTPS on all domains
- [ ] Set appropriate CORS headers for your API
- [ ] Update `BASE_URL` in `src/services/api.js` to production API
- [ ] Test authentication flow in production
- [ ] Enable CDN for static assets (optional for performance)
- [ ] Set up monitoring/error tracking (Sentry, LogRocket)

---

## 📈 Performance Optimization

### Pre-deployment

```bash
# Check bundle size
npm run build
# Check dist/ folder size (aim for < 100 KB gzipped)

# Analyze bundle
npm install -D vite-plugin-visualizer
# Add to vite.config.js, then npm run build
```

### Post-deployment

- Use Lighthouse (Chrome DevTools) to score performance
- Target Lighthouse score: 90+
- Enable gzip compression on server
- Use a CDN for images (Cloudinary, Imgix)
- Cache busting: Vite handles this automatically with hash filenames

---

## 🔄 Continuous Deployment (CD)

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          vercel --prod --token $VERCEL_TOKEN
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Blank page on load** | Check Network tab in DevTools, verify API calls, check console errors |
| **CSS not loading** | Verify `vite.config.js` base path is correct, clear cache |
| **Routes don't work** | Ensure SPA routing is configured (fallback to index.html) |
| **Images broken** | Use absolute URLs or ensure image URLs are accessible from production |
| **Large bundle size** | Run bundle analyzer, check for unused dependencies |
| **Slow deploy** | Verify node_modules in `.gitignore`, use `npm ci` not `npm install` |

---

## 📞 Support & Resources

- **Vite Docs**: https://vitejs.dev/guide/static-deploy.html
- **React Router**: https://reactrouter.com/en/main/start/overview
- **Tailwind CSS**: https://tailwindcss.com/docs/installation
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com/

---

## ✅ Deployment Checklist

Before going live:

- [ ] All tests pass: `npm test`
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in production
- [ ] API calls work and don't expose secrets
- [ ] Mobile responsive (tested on multiple devices)
- [ ] Auth flow works end-to-end
- [ ] Forms submit successfully
- [ ] Images load correctly
- [ ] Search/filter functionality works
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active (HTTPS)
- [ ] Monitoring/error tracking setup
- [ ] Backup/rollback strategy in place

---

**Last Updated**: February 27, 2026  
**Recommended Setup**: Vercel (1-2 minutes, zero config)
