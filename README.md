# 🌿 Navbodh Organic & Healthy — Full Stack eCommerce Website

A complete React + Node.js eCommerce website for Navbodh Organic, Raipur.

## 🗂 Project Structure

```
navbodh/
├── frontend/          # React app (CRA — no Vite)
│   ├── public/
│   └── src/
│       ├── components/   # Navbar, Footer, ProductCard, Marquee
│       ├── context/      # CartContext (persisted to localStorage)
│       ├── pages/        # Home, Products, Mangoes, Cart, Checkout, etc.
│       └── services/     # API calls + static fallback data
└── backend/           # Node.js + Express API
    ├── models/        # Mongoose models: Product, Order, User
    ├── routes/        # REST API routes
    └── server.js
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in details
cp .env.example .env
# Edit .env with your MongoDB URI, email credentials etc.

npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

> **Note**: The frontend includes static product data as fallback — it works even without the backend connected!

## 🔧 Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for auth tokens |
| `EMAIL_USER` | Gmail for sending notifications |
| `EMAIL_PASS` | Gmail app password |
| `ADMIN_EMAIL` | Email to receive orders/enquiries |

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | All products (filter: `?category=mango&featured=true`) |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create product (admin) |
| POST | `/api/products/seed` | Seed all 13 products |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | All orders (admin) |
| PATCH | `/api/orders/:id/status` | Update order status |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/enquiry` | Submit enquiry |

## 🌿 Features

- **Full eCommerce flow**: Browse → Cart → Checkout → Order Success
- **Product catalog** with 13 products (7 mango varieties + dairy, fruits, nuts)
- **Category filter + search** on Products page
- **Cart** with quantity management, persisted in localStorage
- **Order placement** with email notification to admin
- **Enquiry form** with email notification
- **Scrolling marquee** with product list (same as original site)
- **Hero video background** (copyright-free from Pixabay)
- **Unsplash images** (copyright-free) for all products
- **Responsive** — works on mobile, tablet, desktop
- **Sticky mobile call button** (📞 Call Us Now)
- **Organic green theme** with Playfair Display + DM Sans fonts
- **Grain texture overlay** for premium feel
- **Smooth hover effects** and micro-animations

## 🎨 Design

- **Font**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Deep forest green (#1a3d16), warm amber (#e8a020), cream background
- **Theme**: Organic / natural / premium farm-to-table

## 📦 Seed Products

After starting the backend, seed all products:

```bash
curl -X POST http://localhost:5000/api/products/seed
```

## 🚀 Deploy

**Frontend** → Netlify, Vercel, or any static host (`npm run build`)  
**Backend** → Railway, Render, Heroku, or any Node.js host  
**Database** → MongoDB Atlas (free tier)

## 📞 Contact Details in Site

- **Address**: Samta Colony Main Rd, Samta Colony, Raipur, CG 492001
- **Phone 1**: 077140 40459
- **Phone 2**: +91 62615 57175
- **Hours**: Open daily until 8:30 PM
- **Location**: Samta Shopping Arcade

---
Developed by Naman Jain · Made with 💚 in Raipur
