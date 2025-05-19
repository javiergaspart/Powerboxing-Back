# Backend - FitBoxing API

## Overview

This is the backend for the FitBoxing application, built with **Node.js** and **Express.js**. It handles authentication, OTP verification, user management, session bookings, and payments.

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **Firebase Authentication** (For OTP Login)
- **Razorpay** (For Payments)

---

## Getting Started

### 1️⃣ Installation

Clone the repository and install dependencies:

```bash
  git clone https://github.com/your-repo/backend.git
  cd backend
  npm install
```

### 2️⃣ Environment Variables

Create a `.env` file in the **root directory** and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FIREBASE_CREDENTIALS_PATH=./firebase_credentials.json
EMAIL_USER= Email username
EMAIL_PASSWORD==Email App password
```

### 3️⃣ Running the Server

To start the server, run:

```bash
  cd src  # Move to src directory
  node server.js
```

The backend will run at **[http://localhost:5000](http://localhost:5000)**.

---

## API Endpoints

### 🔹 Authentication

- **Register**: `POST /fitboxing/auth/register`
- **Login**: `POST /fitboxing/auth/login`
- **Forgot Password**: `POST /fitboxing/auth/forgot-password`
- **Reset Password**: `POST /fitboxing/auth/reset-password`
- **Send OTP**: `POST /fitboxing/auth/send-otp-phone`
- **Verify OTP**: `POST /fitboxing/auth/verify-otp-phone`

### 🔹 User Management

- **Get Profile**: `GET /fitboxing/users/profile`
- **Change Password**: `POST /fitboxing/users/change-password`
- **Get User by ID**: `GET /fitboxing/users/:id`
- **Update Last Login**: `PUT /fitboxing/users/:id/last-login`
- **Get All Users**: `GET /fitboxing/users`
- **Upload Profile Image**: `POST /fitboxing/users/upload-profile-image/:id`
- **Update Profile**: `PUT /fitboxing/users/updateProfile/:id`

### 🔹 Membership

- **Purchase Membership**: `POST /fitboxing/membership/buy`
- **Get Membership Info**: `GET /fitboxing/membership/details`

### 🔹 Sessions

- **Book a Session**: `POST /fitboxing/sessions/book`
- **Get All Sessions**: `GET /fitboxing/sessions`
- **Get Upcoming Sessions**: `GET /fitboxing/sessions/upcoming`
- **Get Previous Sessions**: `GET /fitboxing/sessions/previous`
- **Check Session Availability**: `GET /fitboxing/sessions/:sessionId/availability`

### 🔹 Payments (Razorpay)

- **Initiate Payment**: `POST /fitboxing/payments/initiate`
- **Verify Payment**: `POST /fitboxing/payments/verify`

---

## Deployment

To deploy the backend, use **Heroku, AWS, or Render**:

```bash
  npm install -g pm2
  pm2 start src/server.js --name fitboxing-backend
```

---

## 🔗 Useful Links

- **Frontend Repo**: [FitBoxing Frontend](https://github.com/ShrutiVerma28/Frontend_Fitboxing/)
- **Live Backend API**: `https://powerboxing-backend.onrender.com`

---

## 📌 Notes

- Make sure your **MongoDB Atlas cluster** is active.
- Ensure that **Firebase Authentication** is properly configured.
- If OTP is not received, check Firebase console logs.

---

**👨‍💻 Developed by SHRUTI VERMA**

