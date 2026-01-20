# RedStore - E-commerce Platform

RedStore is a comprehensive e-commerce platform built with **Laravel 11** and **React 18**. It features a multi-store architecture with dedicated panels for Buyers, Sellers, and Super Admins, integrated with real-time chat and Midtrans payment gateway.

## 🚀 Key Features

### 🛒 Buyer Experience
- **Product Gallery**: Support for both images and videos in product details.
- **Smart Cart**: Automatic subtotal calculation and variant-aware pricing.
- **Secure Checkout**: Integrated with **Midtrans Snap** for seamless payments.
- **Real-time Chat**: Connect with sellers instantly using **Laravel Reverb/Pusher**.
- **Order Tracking**: Detailed order history and payment status monitoring.

### 🏪 Seller Panel
- **Store Management**: Customize store logo, banner, and profile.
- **Product CRUD**: Manage listing with multi-media uploads.
- **Order Fulfillment**: Track and update shipping status (Pending, Processing, Shipped, Delivered).
- **Analytics**: Quick view of store performance and sales.

### 🛡️ Admin Dashboard
- **System Stats**: Overview of total users, stores, revenue, and recent activities.
- **User Moderation**: Manage user accounts and enforce bans if necessary.
- **Store Verification**: Review and verify new store applications.
- **Category Management**: Organize the platform's product hierarchy.

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 11
- **Auth**: Laravel Sanctum (SPA Authentication)
- **Real-time**: Laravel Echo + Reverb/Pusher
- **Payment**: Midtrans PHP SDK
- **Database**: MySQL/PostgreSQL

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Laravel Echo + Pusher JS
- **UI Components**: Headless UI + React Hot Toast

## 🏁 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer & NPM

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your `.env` (Database, Midtrans, Reverb/Pusher).
5. Run migrations and seed data:
   ```bash
   php artisan migrate:fresh --seed
   ```
6. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` (API URL, Midtrans Client Key, Reverb Keys).
4. Start development server:
   ```bash
   npm run dev
   ```

## 👥 Seeded Credentials
- **Admin**: `admin@redstore.com` / `password`
- **Seller**: `seller1@redstore.com` / `password`
- **Buyer**: `buyer1@redstore.com` / `password`

---
Built with Laravel 11 and React 18 for High-Performance E-commerce.
