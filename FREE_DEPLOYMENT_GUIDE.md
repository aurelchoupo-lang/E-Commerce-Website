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
    - **Start Command**: `gunicorn core.wsgi:application`
    - **Instance Type**: `Free`
4. Expand **Advanced** and add these Environment Variables:
    - `PYTHON_VERSION`: `3.10.0` (or whatever your local version is)
    - `SECRET_KEY`: Generate a random long string 
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: `*` (You can restrict this to your frontend URL later)
5. Click **Create Web Service**. Render will now automatically install your dependencies, run migrations, and launch your API!
6. Once deployed, copy your backend URL (e.g. `https://ecommerce-backend-api.onrender.com`).

> **Note**: Render's free tier spins down after 15 minutes of inactivity. It may take ~30 seconds for your backend to "wake up" when you make your first request of the day.

---

## Part 2: Deploying the React Frontend (Vercel)

Vercel is incredible for React applications and connects directly to GitHub.

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

---

## Next Steps
Congratulations! The site is now live on the internet and communicating securely between the frontend and backend without paying a single cent.

### Updating Your Site
Because both platforms are linked to your GitHub repository, **all you have to do is push new code to GitHub**. 
Vercel and Render will automatically detect the changes, pull the code, build it, and deploy it for you seamlessly!
