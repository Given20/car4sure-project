
# 🚗 Car4Sure Policy Management

This project is a **Laravel + Angular full-stack app** for managing car insurance policies.

It’s built with **young, first-time car owners (ages 20–35)** in mind — making it easy to register, log in, and manage all your car insurance details securely through the Car4Sure platform.

---

# 🚗 Explanation for my implementation

I'm using Angular with Laravel because it's a solid full-stack combo that cleanly separates frontend and backend concerns. Laravel handles the API and business logic really well, while Angular gives me the flexibility to build a fast, responsive UI with strong form and route management.

I'm already familiar with Angular and genuinely enjoy working with it, especially for complex form flows like the policy management features. It helps me move faster and build a better experience for users.



## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication using Laravel Sanctum
- Access control: users can only access their own data
- Automatic token refresh to stay logged in

### 📋 Policy Management
- Full **Create, Read, Update, Delete (CRUD)** support
- Store and manage:
  - Policy numbers, types, statuses
  - Policyholder and driver details
  - Vehicle information and addresses
  - Coverages (including deductibles and limits)
- Every action is scoped to the authenticated user

### 🖥️ Angular Frontend
- Clean and responsive user interface
- Form validation on both frontend and backend
- Uses Angular Reactive Forms
- Auth guard to protect routes and pages

---

## 🧰 Tech Stack

**Backend (Laravel):**
- PHP 8.1+
- Laravel 10
- Sanctum for authentication
- MySQL (and SQLite for local testing)

**Frontend (Angular):**
- Angular 18+
- Angular HTTP client
- Reactive Forms


## 🚀 Getting Started

### ✅ Backend (Laravel API)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy and edit the environment config:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Set database settings in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=car4sure_db
   DB_USERNAME=root
   DB_PASSWORD=yourpassword
   ```

5. Run database migrations:
   ```bash
   php artisan migrate
   ```

6. Start the API server:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

---

### ✅ Frontend (Angular App)

1. Navigate to the Angular project:
   ```bash
   cd frontend/policy-management-app
   ```

2. Install Angular packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve --host 0.0.0.0 --port 4200
   ```

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt
- Uses Laravel Sanctum for secure tokens
- All inputs validated on both frontend and backend
- Policies are user-scoped (only your data is accessible)
- API protected via middleware and tokens

---

### 📸 Demo
Or watch a demo video [here](https://drive.google.com/file/d/1Oz7rLvkzI1A2F52UzQ_DF_MG6CmUboX7/view?usp=drive_link).