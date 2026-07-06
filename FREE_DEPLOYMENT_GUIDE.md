# 🚀 Free Deployment Guide

This guide will show you how to deploy this full-stack application completely for **$0/month** using modern cloud providers with generous free tiers.

## Architecture Choice
- **Frontend (React)**: [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) (Fast, free global edge networks)
- **Backend (Django)**: [Render.com](https://render.com/) (Offers a free tier for Python web services)
- **Database**: We will use SQLite on Render, or you can provision a free PostgreSQL DB on Render (free for 90 days) or Supabase (forever free).

---

## Part 1: Deploying the Django Backend (Render)

Render is the absolute easiest way to deploy Python/Django for free.

### Prerequisites
1. Push your entire repository to GitHub.
2. Create a free account on [Render](https://dashboard.render.com).

### Step-by-Step
1. Inside Render, click **New +** and select **Web Service**.
2. Connect your GitHub account and select your `E-commerce Website` repository.
3. Configure the web service as follows:
    - **Name**: `ecommerce-backend-api` (or any name)
    - **Root Directory**: `E-commerce Backend`
    - **Environment**: `Python`
    - **Build Command**: `./build.sh`
    - **Start Command**: `python manage.py migrate && gunicorn core.wsgi:application` (⚠️ IMPORTANT: Running migrations on startup is required for SQLite on Render so the tables are created when the container boots or wakes up).
    - **Instance Type**: `Free`
4. Expand **Advanced** and add these Environment Variables:
    - `PYTHON_VERSION`: `3.10.0` (or whatever your local version is)
    - `SECRET_KEY`: Generate a random long string 
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: `*` (You can restrict this to your frontend URL later)
    - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend.vercel.app` (Replace with your actual Vercel URL, this is crucial for registering/logging in without security errors).
5. Click **Create Web Service**. Render will now automatically install your dependencies, run migrations, and launch your API!
6. Once deployed, copy your backend URL (e.g. `https://ecommerce-backend-api.onrender.com`).

> **Note**: Render's free tier spins down after 15 minutes of inactivity. It may take ~30 seconds for your backend to "wake up" when you make your first request of the day.

---

---

## 🔎 Site Navigation & Features

Once deployed, here is where you can find all key options and features of the E-commerce website:

### 🏠 Homepage (The Marketplace)
- **Search Bar**: Located at the top, allows searching products by title or description.
- **Category Filter**: Below the search bar, click on any category (e.g., Electronics, Furniture) to filter listings.
- **Advanced Filters**: 
    - Click **"Show Filters"** to reveal Price Range, Local Items, and Durable Items toggles.
    - **Min/Max Price**: Filter items by budget.
    - **Local/Durable**: Toggle eco-friendly and local sourcing filters.
- **Sorting**: Use the dropdown (top right of item list) to sort by Newest, Oldest, Price, or Title.

### 📦 Product & Listing Management
- **Item Cards**: Hover over any item to see quick details; click for the full product page.
- **Product Details**: 
    - View full description, price, condition, and location.
    - **Wishlist**: Click the heart icon to save items for later.
    - **Report Item**: Found on the product page to flag prohibited or suspicious content.
- **Sell Item** (Navbar): Accessible to Sellers and Admins. Provides a form to add a new listing with image upload or URL.
- **My Listings** (Navbar): A personal dashboard to manage your active listings (Edit, Delete, Track Sales).

### ⚙️ User Settings
- **Profile Management**: Update your name, avatar, and contact info under **Settings**.
- **Security**: Change your password or delete your account in the Security tab of Settings.

### 🛡️ Admin Center (Admin Only)
- **Admin Dashboard**: Accessible via the "Admin" link in the navbar for authorized users.
- **User Management**: Oversee all users, change roles (Buyer/Seller/Admin), and manage account status.
- **Items Management**: A master list of all products on the platform for global moderation.
- **Reports Management**: View reported items and take action (dismiss or remove) to keep the community safe.

---

## Part 2: Deploying the React Frontend (Vercel)

Vercel is incredible for React applications and connects directly to GitHub. A `vercel.json` file has been added to your `E-commerce Frontend` directory to automatically configure routing redirects to avoid `404 NOT_FOUND` errors when refreshing sub-pages.

### Prerequisites
1. Ensure your repository is pushed to GitHub.
2. Create a free account on [Vercel](https://vercel.com/signup).

### Step-by-Step
1. Click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the project config:
    - **Project Name**: `ecommerce-frontend`
    - **Framework Preset**: `Vite`
    - **Root Directory**: `E-commerce Frontend`
4. Expand **Environment Variables** and add:
    - `VITE_API_BASE_URL`: Paste the Render URL from Part 1 here (e.g. `https://ecommerce-backend-api.onrender.com/api`)
5. Click **Deploy**. Vercel will build and host your site on a secure `https://...vercel.app` domain within seconds.
    - ⚠️ **IMPORTANT**: If you ever update or add environment variables in Vercel later, you must redeploy by choosing **"Redeploy"** and **unchecking "Use existing build cache"** (Clean Build). Vite embeds environment variables at build-time, and using the build cache will prevent new variables from taking effect.

---

## ⚡ Deployment Cheat Sheet

### Backend (Render)
- **Repo Root**: `/E-commerce Backend`
- **Build Command**: `./build.sh`
- **Start Command**: `python manage.py migrate && gunicorn core.wsgi:application` (Required to migrate SQLite at startup)
- **Required Env Vars**:
    - `SECRET_KEY`: (Any long random string)
    - `ALLOWED_HOSTS`: `*` (or your frontend domain)
    - `DEBUG`: `False`
    - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend.vercel.app` (To allow forms, auth, and state changes)
    - `DATABASE_URL`: (Optional, SQLite is used by default)

### Frontend (Vercel)
- **Repo Root**: `/E-commerce Frontend`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Required Env Vars**:
    - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`

---

## Next Steps
Congratulations! The site is now live on the internet and communicating securely between the frontend and backend without paying a single cent.

### Updating Your Site
Because both platforms are linked to your GitHub repository, **all you have to do is push new code to GitHub**. 
Vercel and Render will automatically detect the changes, pull the code, build it, and deploy it for you seamlessly!
