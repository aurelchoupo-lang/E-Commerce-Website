# E-commerce Backend (Django REST API)

Powerful, scalable backend built with **Django** and **DRF**, providing a RESTful interface for the marketplace frontend.

---

## 🛠️ Tech Stack
- **Django 5.0** — High-level Python Web framework.
- **Django REST Framework** — Toolkit for building Web APIs.
- **SQLite 3** — Simple, reliable, and portable database.
- **CORS Headers** — Cross-Origin Resource Sharing for frontend communication.
- **Pillow** — Image processing for product photos.

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- `pip`

### 1. Installation
```bash
# Activate virtual environment (Windows example)
.\venv\Scripts\activate

# Install requirements
pip install django djangorestframework django-cors-headers django-filter pillow drf-extra-fields
```

### 2. Database & Admin
```bash
# Apply initial migrations
python manage.py migrate

# Create a superuser (for Django Admin)
python manage.py createsuperuser
```

### 3. Run Development Server
```bash
python manage.py runserver 8000
```
API is accessible at **http://localhost:8000/api/**.

---

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|---|---|---|
| `/api/register/` | POST | Register a new user |
| `/api/login/` | POST | User login + Token retrieval |
| `/api/logout/` | POST | User logout |

### Products
| Endpoint | Method | Description |
|---|---|---|
| `/api/products/` | GET | List all products (paginated) |
| `/api/products/` | POST | Create a new listing |
| `/api/products/:id/` | GET/PATCH/DELETE | Retrieve, update, or delete a product |

### Admin & Feedback
| Endpoint | Method | Description |
|---|---|---|
| `/api/users/` | GET/DELETE | Manage registered users (Admin only) |
| `/api/reports/` | GET/POST/PATCH | Item reporting and resolution |
| `/api/reviews/` | GET/POST | Seller reviews and ratings |
| `/api/wishlist/` | GET/POST/DELETE | Persistent user wishlists |

---

## 📂 Directory Structure

### `core/`
The heartbeat of the Django project.
- `settings.py`: Contains all system configurations, including database setup, installed apps (REST Framework, CORS), and security middleware.
- `urls.py`: The root URL configuration that routes traffic to the `products` application and the built-in admin panel.

### `products/`
The primary functional module of the marketplace.
- `models.py`: Defines the database tables and relationships.
    - `Product`: Stores listing details (title, price, stock, category, eco-metrics).
    - `Review`: Stores seller ratings and comments.
    - `Report`: Tracks flagged content and its resolution status.
    - `Wishlist`: Manages many-to-many relationships between users and their saved items.
- `serializers.py`: Acts as the translator between database models and JSON data, ensuring secure and valid data transmission.
- `views.py`: Implements the "Business Logic." It handles API requests, enforces permissions (e.g., only admins can delete users), and interacts with the database.
- `urls.py`: Maps specific API endpoints (like `/api/products/`) to their respective view controllers.

### Root Files
- `manage.py`: The primary command-line tool for running the server, creating migrations, and managing the database.
- `db.sqlite3`: The persistent storage file where all marketplace information is kept.

---

## 🏗️ Technical Details

### Security & Authentication
- **DRF Token Auth**: Users receive a unique token upon login, which must be included in the `Authorization` header for all protected actions (like adding an item).
- **Role Enforcement**: The backend verifies if a user is an `admin`, `seller`, or `buyer` before allowing sensitive operations.

### Data Integrity
- **Migrations**: Every change to the `models.py` is tracked via Django migrations, ensuring the database schema stays in sync across all environments.
- **Validation**: Serializers perform strict validation on incoming data (e.g., checking if a price is positive) before saving to the database.

### Integration
- **CORS Configuration**: The `django-cors-headers` middleware is configured to securely allow requests from the React frontend development server (`localhost:5173`).
- **RESTful Principles**: The API follows standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) for a predictable and clean interface.
