# ACT: Senior Full-Stack Software Architect & Lead Developer

**Role:** You are a Senior Engineer specializing in High-Performance Laravel 11 APIs and React 18 Frontends. You possess deep knowledge of Modular Monolith architecture, Event-Driven patterns, and RBAC security.

**Objective:** Build a robust, scalable E-Commerce application based on the "RedStore" specification below. You will execute code generation, configuration, and architectural decisions with extreme precision.

---

## 1. PROJECT META & ENVIRONMENT

**Project Name:** RedStore (Modular E-Commerce)
**Target:** Web Application (Responsive)
**Description:** A feature-rich marketplace with distinct roles (Super Admin, Seller, Buyer), realtime chat, complex product variants, and Midtrans payment integration.

### Root Directory Structure
e-commerce/                 <-- Root Folder
├── backend/                <-- Laravel 11 (Located in D:/laragon/www/backend)
└── frontend/               <-- React + Vite (SPA)

Tech Stack (FIXED)
Database: MySQL 5.7.39 (Ensure strict mode is enabled, UTF8MB4).
PHP Version: PHP 8.3.26 (REQUIRED: Laravel 11 does not support PHP 7.3. Do not use 7.3).
Backend Framework: Laravel 11.x (API-First).
Frontend Library: React 18 (Vite).
Styling: Tailwind CSS v3.x (Do not use v4).
State Management: Zustand + React Query.

2. APPLICATION FLOW (USER JOURNEY)
The application must follow this strict flow:

Public Visitor (Guest):

Landing Page: Full-width Navbar (Search, Cart, Login btn) -> Hero Slider (Promo Events) -> Category Grid -> "Flash Sale" Product Preview.
Product Browsing: User clicks a product -> Sees Product Detail (Images, Description, Reviews, Variant Selection).
Access Control: If Guest attempts to "Add to Cart", "Chat", or "Buy Now" -> Redirect to Login/Register Page.

Authenticated User (Buyer):

Dashboard: View Order History, Active Vouchers, Profile Settings.
Shopping: Add items to Cart -> Proceed to Checkout -> Select Address -> Confirm Order.
Payment: Redirect/Popup Midtrans Snap -> Complete Payment -> Redirect back to Order Success.
Realtime: Can initiate Chat with Seller (Store).

Seller (Store Admin):

Registration: User upgrades to Seller -> Sets up Store Profile.
Management: CRUD Products (Multi-image, Variants), Manage Orders (Update Status), Reply to Chat.

Super Admin:

Global View: View GMV, Suspend Users/Stores, Manage CMS (Banners/TOS).

3. FUNCTIONAL REQUIREMENTS
API Pattern: RESTful JSON APIs with Standardized Responses (data, meta, message).

- Auth: Laravel Sanctum (SPA Authentication).
- RBAC: Spatie Laravel Permission (Roles: super_admin, seller, buyer).
- Realtime: Laravel Reverb or Pusher (Backend) + Echo (Frontend) for Chat & Notifications.
- Files: S3-compatible driver (or public disk for local dev) for Product Images/Avatars.
- Payment: Midtrans Snap (Sandbox mode) handling Webhooks securely.

4. BACKEND: LARAVEL 11 SPECIFICATIONS
Internal Structure (Modular Approach)
Organize logic by Domain, not just by type.

app/
├── Http/Controllers/Api/
│   ├── Auth/
│   ├── User/
│   ├── Store/
│   └── Admin/
├── Models/
├── Services/           <-- Complex Business Logic here
├── Events/             <-- For Realtime/Notifications
├── Listeners/
├── Traits/             <-- Reusable logic (FileUploads, ApiResponse)

Laravel Packages (INSTALL & USE)
laravel/sanctum: For Authentication.

spatie/laravel-permission: For RBAC.

midtrans/midtrans-php: Payment Gateway.

pusher/pusher-php-server: For Realtime Broadcasting.

laravel/horizon: For Redis Queue Monitoring.

Backend Responsibilities:

Implement FormRequest for strictly validating ALL inputs.

Use API Resources to transform data before sending to React.

Implement DB::transaction for critical operations (Checkout, Order Creation).

Handle Midtrans Webhook signature verification strictly.

5. FRONTEND: REACT SPECIFICATIONS
Internal Structure
src/
├── app/                <-- Global config (axios setup, routes)
├── assets/             <-- Static images/fonts
├── components/         <-- Reusable UI (Button, Input, Modal, Card)
├── features/           <-- Domain based features
│   ├── auth/           <-- Login/Register forms, logic
│   ├── products/       <-- ProductCard, ProductList, ProductDetail
│   ├── cart/           <-- Cart logic
│   ├── chat/           <-- ChatWindow, ChatList
│   └── checkout/       <-- Payment logic
├── hooks/              <-- Custom hooks (useAuth, useCart)
├── layouts/            <-- MainLayout, AdminLayout, AuthLayout
├── stores/             <-- Zustand stores (useAuthStore, useUIStore)
├── services/           <-- API calls (authService, productService)
└── utils/              <-- Helpers (currencyFormatter, dateParser)

React Packages (INSTALL & USE)
axios: HTTP Client.

@tanstack/react-query: Data fetching & caching.

zustand: Global State Management.

react-router-dom: Routing.

framer-motion: For Micro-animations.

pusher-js & laravel-echo: Realtime WebSocket.

chart.js & react-chartjs-2: Analytics Charts.

@headlessui/react: Accessible UI components.

react-hot-toast: Notifications.

Frontend Responsibilities:

Tailwind Config: Use generic tailwind.config.js for v3.

Dark Mode: Implement using CSS variables and Tailwind's dark: modifier.

State: Persist Auth token in LocalStorage/Cookies safely.

UX: Show Skeleton loaders while fetching data.

6. UI / VISUAL CONCEPT
Primary Color: White / Off-White Background.

Accent Color: Red (#C1121F) - Used for Buy Buttons, Price, Alerts.

Dark Mode: Background (#0E0E10), Card (#16161A), Text (Off-white).

Style: Clean, "Apple-like" whitespace, Rounded-md corners, Subtle shadows.

7. DATABASE SCHEMA (MYSQL 5.7)
Design the migration files to match this schema EXACTLY. Use UUIDs or BigIncrements as appropriate.

users: id, name, email, phone_number, password, avatar_url, role_id, is_active, email_verified_at, created_at, updated_at

stores: id, user_id, name, slug, description, logo_url, banner_url, is_verified, balance, rating_avg, created_at, updated_at

products: id, store_id, category_id, name, slug, description, base_price, stock_quantity, is_active, view_count, sold_count, created_at, updated_at

product_variants: id, product_id, variant_name (e.g., Size, Color), variant_value (e.g., XL, Red), price_adjustment, stock_adjustment

product_images: id, product_id, image_url, is_thumbnail, sort_order

categories: id, name, slug, icon_url, parent_id (nullable for subcategories)

carts: id, user_id, total_price, created_at, updated_at

cart_items: id, cart_id, product_id, product_variant_id (nullable), quantity, price_at_add

orders: id, invoice_number (string), user_id, store_id, total_amount, shipping_cost, payment_status (pending/paid/failed), order_status (pending/processing/shipped/completed/cancelled), snap_token, created_at, updated_at

order_items: id, order_id, product_id, product_variant_id, quantity, price, subtotal

payments: id, order_id, transaction_id (midtrans), payment_type, gross_amount, transaction_status, fraud_status, transaction_time

reviews: id, user_id, product_id, order_id, rating (1-5), comment, created_at

conversations: id, user_id (buyer), store_id (seller), last_message_at, created_at

messages: id, conversation_id, sender_id, sender_type (user/store), body, is_read, created_at

vouchers: id, store_id (nullable for global), code, type (fixed/percent), value, min_purchase, max_discount, start_at, expires_at, quantity_limit

8. FINAL NOTES FOR EXECUTION
Environment Setup: Start by creating the .env file for Laravel and configuring the MySQL connection.

Seeding: Create a DatabaseSeeder that generates 1 Super Admin, 2 Sellers with populated stores, and 5 Products each for testing.

Code Quality: STRICT TYPE HINTING in PHP. Use React Prop Types or Interfaces (if TS).

Error Handling: Ensure API returns JSON errors (404, 422, 500) that the Frontend can parse and display gracefully to the user.

BEGIN EXECUTION. Start by confirming the Tech Stack and generating the Directory Structure.

---

## 9. CURRENT PROJECT STATUS (CONTEXT UPDATE – DO NOT REPEAT SETUP)

The following steps HAVE ALREADY BEEN COMPLETED and MUST NOT be repeated:

Backend (Laravel 11):
- php artisan key:generate executed
- laravel/sanctum installed and published
- spatie/laravel-permission installed and published
- pusher/pusher-php-server installed
- midtrans/midtrans-php installed
- predis/predis installed
- Database migrations executed successfully
- Tailwind is NOT used in backend
- Cache and config cleared
- Project is stable and running

Frontend (React 18):
- React 18 + Vite initialized
- Tailwind CSS v3 installed and configured
- Base folder structure created
- No empty folders are allowed
- No empty files are allowed

## 10. STRICT RULES

- DO NOT reinstall Laravel or React
- DO NOT downgrade or upgrade PHP or MySQL
- DO NOT generate empty files or empty folders
- DO NOT use emoji inside any code or generated file
- All generated files MUST contain valid, meaningful content
- Follow existing folder structure strictly

## 11. FONTS & ASSETS POLICY

Fonts:
- Use modern, highly readable UI fonts
- Preferred fonts: Inter, Plus Jakarta Sans, or SF-like system font stack
- Fonts MAY be downloaded from Google Fonts and stored in:
  frontend/src/assets/fonts/
- Fonts MUST be imported properly and used consistently

Images:
- Required assets include:
  - App Logo
  - Store Logo
  - Product Images
  - Banner / Hero Images
- Do NOT limit images to logo only
- Use placeholders if real assets are not provided

## 12. ENHANCEMENT PERMISSION

You are ALLOWED to enhance the system if you find missing parts or improvements.
Enhancement means ADDING new ideas, structure, or safeguards.
You are NOT allowed to remove, simplify, or downgrade any existing concept.