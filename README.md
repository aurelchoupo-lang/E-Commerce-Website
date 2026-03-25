# E-commerce Marketplace

A modern, full-stack e-commerce platform with a **React** frontend and a **Django** backend. This project features a bilingual UI (EN/FR), dark/light themes, eco-responsibility indicators, and a robust administrative dashboard.

## 🏗️ Architecture

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS 3](https://tailwindcss.com/).
- **Backend**: [Django 5.0](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/).
- **Database**: [SQLite](https://www.sqlite.org/) (default).

---

## 🚀 Quick Start

### 1. Backend Setup (Django)
The backend manages data persistence, authentication, and the REST API.
```bash
# Navigate to the backend directory
cd "E-commerce Backend"

# Create a virtual environment (if not already done)
python -m venv venv

# --- CRITICAL: ACTIVATE THE VIRTUAL ENVIRONMENT ---
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies into the virtual environment
pip install django djangorestframework django-cors-headers django-filter pillow drf-extra-fields

# Apply database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver 8000
```

### 2. Frontend Setup (React)
The frontend provides the interactive user interface.
```bash
# Navigate to the frontend directory
cd "E-commerce Frontend"

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

Integrated Application URL: **http://localhost:5173** (Vite proxies API calls to port 8000).

---

## 🔑 Admin Credentials
An administrator account is available for managing users and content:
- **Email:** `admin@example.com`
- **Password:** `admin`

You can access the Django Admin interface directly at **http://localhost:8000/admin/**.

---

## ✨ Features
- **Persistent Data**: All products, users, wishlists, and reviews are stored in a real SQLite database.
- **Backend Authentication**: Secure login and registration using Django REST Framework tokens.
- **Admin Dashboard**: Comprehensive tools for managing users and resolving content reports.
- **Internationalization**: Full bilingual support (English & French) managed via React Context.
- **Eco-Responsibility**: Integrated indicators for carbon footprint and reparability.

---

## 📂 Project Structure

### [/E-commerce Backend](file:///d:/test%20code/E-commerce%20Website/E-commerce%20Backend)
The core logic and data management layer.
- `core/`: Main Django project configuration (settings, URLs, WSGI).
- `products/`: Principal application module containing:
    - `models.py`: Database schema for Products, Reviews, Reports, and Wishlists.
    - `views.py`: API logic and endpoint controllers.
    - `serializers.py`: Data transformation logic between Python objects and JSON.
    - `urls.py`: Routing for the backend API endpoints.
- `manage.py`: Django's command-line utility for administrative tasks.
- `db.sqlite3`: The local database file containing all project data.

### [/E-commerce Frontend](file:///d:/test%20code/E-commerce%20Website/E-commerce%20Frontend)
The interactive marketplace interface.
- `src/`: Source code for the React application.
    - `pages/`: Individual view components (Home, Product Details, Admin, etc.).
    - `components/`: Smaller, reusable UI elements (Navbar, Item Cards, Modals).
    - `services/api.js`: The communication layer that connects the frontend to the Django API.
    - `context/`: State management for global features like Theme and Language.
    - `translations.js`: Dictionary for all UI text in English and French.
- `index.html`: The main entry point for the browser.
- `tailwind.config.js`: Configuration for the utility-first CSS framework.
- `vite.config.js`: Build tool configuration, including the backend API proxy.

For more specialized details, refer to the README files within each respective directory.
