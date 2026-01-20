ROLE: Senior System Architect & Principal Full-Stack Engineer

You are assigned to redefine, correct, and enhance the RedStore application into a professional multi-vendor e-commerce platform, not a demo or template. Your task is execution-oriented: analyze the current codebase, identify mismatches between intent and implementation, and implement missing, incorrect, or sub-optimal logic and UI to reach production-grade quality.

CORE INTENT (DO NOT MISINTERPRET)

RedStore is a multi-vendor marketplace platform:

Buyers purchase products.

Sellers (stores) sell products.

Super Admin operates the platform company, does NOT sell products, and earns revenue via platform fees per transaction.
All logic, UI, data flow, and dashboards must reflect this clearly.

UI / LAYOUT ENHANCEMENT (MANDATORY)

Upgrade the UI from “basic Tailwind” to professional-grade e-commerce UI.

You may introduce ONE UI library if it improves quality (e.g. shadcn/ui, Radix-based components, or Headless UI enhancements).

Avoid bloated component libraries.

Maintain Tailwind as the styling foundation.

Footer:

Replace the minimal footer with a structured, information-rich footer (About, Help, Policies, Seller Info, Socials).

Responsive & Mobile UX:

Fix all responsive issues.

Product listing on mobile must show 2-column grid or zig-zag layout, not single-column.

Ensure touch-friendly spacing and readable typography.

Homepage Hero:

Remove static “Welcome to RedStore” section.

Replace with Event Slider (CRUD by Super Admin).

Implement admin-side slider/banner management.

Product Card Enhancements:

Show rating (or “No reviews yet”).

Show total sold count.

Product Detail Page:

Add:

Reviews section

Total sold quantity

Related products by category (limit 12 + “View More” lazy load)

More products from the same store (limit + pagination)

Optimize for performance (no full-table loads).

SELLER LOGIC (CRITICAL FIXES)

Fix data inconsistency:

Seeded seller products exist in DB but do not appear in seller dashboard.

Correct queries, scopes, and ownership logic.

Product Creation:

Add image preview before submit.

Allow selecting thumbnail via star icon.

Fix API failure on save despite valid request.

Seller Dashboard:

Implement Chart.js analytics:

Revenue

Orders

Top products

Conversion summary

Seller Chat:

Add real-time chat tab inside seller dashboard.

Seller must see and respond to buyer messages in real time.

SUPER ADMIN LOGIC (RESTRUCTURE)

Remove selling logic from Super Admin.

Super Admin must NOT have “revenue from products”.

Redefine Super Admin metrics:

Platform GMV

Total orders

Platform fee revenue

Active sellers & buyers

Users & Stores Management:

Implement paginated listing (no full DB load).

Implement suspend/verify actions.

Categories:

Decide logically:

If global taxonomy → Super Admin manages

If store-defined → move to seller

Implement consistently.

Platform Fee Logic:

Implement automatic fee deduction per transaction (e.g. fixed or percentage).

Store fee records and platform balance.

BUYER LOGIC (FIX & COMPLETE)

Midtrans Integration:

Fix missing ServerKey/ClientKey issue.

Replace config placeholders with environment-based config.

Ensure checkout works end-to-end.

Chat Before Purchase:

Enable chat directly from product detail page.

Auto-initiate chat with the product’s store.

Auto-reference the product inside chat context.

Buyer Features:

Order history

Messages

Reviews

All must be functional, not placeholder.

GLOBAL FUNCTIONAL REQUIREMENTS

Midtrans:

Proper config usage.

Secure webhook handling.

Transaction lifecycle correctness.

Store Page:

Create dedicated seller/store profile page:

Store logo & banner

Total products

Average rating

Review count

Join date

Data must be real, not dummy.

Search:

Fully functional search bar.

Paginated results.

Optimized queries.

Performance:

No “load all” queries.

Use pagination, lazy loading, and limits everywhere.

Floating Chat UI:

Implement Shopee-like floating chat widget.

Only visible to logged-in users.

Modal shows chat history with all sellers.

Auth & Navigation:

Logout must be a real API-backed action.

Clean routing (/login, /dashboard, /seller, /admin).

Enforce role-based access everywhere.

EXECUTION RULES

Access and review the entire codebase.

Fix UI, UX, logic, architecture, and performance issues.

Replace placeholders and incomplete logic.

Follow best practices for:

Laravel (services, policies, transactions)

React (state management, composition, performance)

Do NOT remove features.

You may enhance and extend, never reduce scope.

FINAL GOAL

Deliver RedStore as a real, scalable, professional multi-vendor e-commerce platform that feels comparable to modern marketplaces in terms of UX, architecture, and logic.

Begin execution immediately.