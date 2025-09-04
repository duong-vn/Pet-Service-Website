

# 🐾 ZoZo Pet Services

A full-stack web application for booking pet care services such as bathing, grooming, and more.
Built with **Next.js** (frontend) and **NestJS** (backend), the platform provides a modern, responsive, and secure experience for both customers and administrators.

---

## 🚀 Features

* **Authentication**

  * Google OAuth & local login
  * JWT access/refresh token system with secure cookies
  * Role-based access control (Admin, Staff, User, Banned)

* **Booking System**

  * Create, manage, and cancel pet service appointments
  * Real-time slot availability
  * Price rules based on pet type & weight ranges
  * Email notifications (confirmation, reminders) using Nodemailer & Handlebars

* **Admin Dashboard**

  * Manage services, appointments, and users
  * Dynamic data tables with filtering & pagination
  * Dark mode & responsive UI

* **Media & Storage**

  * Pet images securely stored on **Cloudinary**
  * Optimized delivery with `f_auto` and `q_auto`

* **Performance & Security**

  * Rate limiting & health checks
  * Secure environment variables
  * API protection with global JWT guard

---

## 🛠️ Tech Stack

**Frontend**

* Next.js v15 (App Router)
* React Query
* Redux Toolkit
* Tailwind CSS + Framer Motion

**Backend**

* NestJS v11
* MongoDB + Mongoose
* Nodemailer + Handlebars
* Cloudinary

**Deployment**

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Media: Cloudinary

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/your-username/zozo-pet-services.git
```

### Frontend Setup

```bash
cd FrontEnd-NextJS/pet-service
npm install
npm run dev
```

### Backend Setup

```bash
cd BackEnd-NestJS/pet-service
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Frontend (`.env`)

```env
CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com


NEXT_PUBLIC_API_BASE_URL=https://backend.com

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=environmentnameoncloudinary
NODE_ENV=development
```

### Backend (`.env`)

```env
PORT=8080
MONGO_URL=mongodb+srv://xxxxxxxxxxclusterx.xxxxxxxx.mongodb.net/xxxx
FE_BASE_URL=http://frontend.com
NODE_ENV=development

# JWT
JWT_ACCESS_TOKEN_SECRET=XXXXXXXXXXXXXX
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_TOKEN_SECRET=XXXXXXXXXX
JWT_REFRESH_EXPIRE=1d

# Authorization
AUTHZ_SECRET=XXXXXXXXXXXX
AUTHZ_EXPIRE=15m

# Verification
VERIFY_TOKEN_SECRET=XXXXXXXXXX
VERIFY_TOKEN_EXPIRE=30m

# Cookie
COOKIE_EXPIRE=86400000

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_AUTH_USER=XXXXXXXXXX@gmail.com
EMAIL_AUTH_PASS=XXXX XXXX XXXX XXXX
EMAIL_PREVIEW=false

# Initial setup
SHOULD_INIT=false
INIT_PASSWORD=XXXXXXXXXX

# Cloudinary
CLOUDINARY_CLOUD_NAME=envnameoncloudinary
CLOUDINARY_API_KEY=XXXXXXXXXX
CLOUDINARY_API_SECRET=XXXXXXXXXXX
CLOUDINARY_UPLOAD_PRESET=yourpreset
```

---

## 📸 Screenshots

![Page Screenshot](https://res.cloudinary.com/dmgtkwdee/image/upload/v1756968657/a66d6a47-425c-4d1e-b4d3-7acc5e51fe8c.png)

---


## 👤 Author

* **Nguyễn Tuấn Dương**
* Aspiring **Full-Stack Developer** (Next.js + NestJS)
* [Email](duongnguyenhust@gmail.com)

---
