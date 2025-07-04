# DesignCrafter.AI

A full-stack AI-powered poster and asset generation platform.

---

## 🚀 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Running the Project](#running-the-project)
7. [Authentication Flow](#authentication-flow)
8. [Database Structure](#database-structure)
9. [API Endpoints](#api-endpoints)
10. [Frontend Features](#frontend-features)
11. [Admin Features](#admin-features)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)
15. [License](#license)

---

## 📝 Project Overview

**DesignCrafter.AI** is a modern platform for generating, managing, and sharing AI-generated posters and assets.  
It features user authentication, asset management, admin controls, and seamless integration with Google Vertex AI and Firebase.

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Email/Password, Google)
- **Cloud Storage:** Firebase Storage (for images)
- **AI Service:** Google Vertex AI (for image generation)
- **Deployment:** Vercel/Netlify (Frontend), Google Cloud Run (Backend)

---

## 📁 Project Structure

```
DesignCrafterAI/
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── firebase/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
├── Server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── index.js
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🏁 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/designcrafter-ai.git
cd designcrafter-ai
```

---

## 🖥️ Frontend Setup (`Client`)

1. **Navigate to the Client folder:**
    ```bash
    cd Client
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the frontend development server:**
    ```bash
    npm run dev
    ```

---

## 🗄️ Backend Setup (`Server`)

1. **Navigate to the Server folder:**
    ```bash
    cd ../Server
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file in the `Server` folder with your Firebase Admin and Google Cloud credentials:**
    ```
    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_API_KEY=
    GEMINI_API_URL=
    GEMINI_API_KEY=
    GCLOUD_PROJECT=
    GCS_BUCKET=
    GOOGLE_APPLICATION_CREDENTIALS=absolute/path/to/your/service-account.json
    PORT=5000
    ```

4. **Start the backend server:**
    ```bash
    nodemon index.js
    ```

---

## 🌱 Environment Variables

### Client (`Client/.env`)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=https://your-backend-url/api
```

### Server (`Server/.env`)
```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_API_KEY=
GEMINI_API_URL=
GEMINI_API_KEY=
GCLOUD_PROJECT=
GCS_BUCKET=
GOOGLE_APPLICATION_CREDENTIALS=absolute/path/to/your/service-account.json
PORT=5000
```

---

## ▶️ Running the Project

**Start the backend:**
```bash
cd Server
npm run dev
```

**Start the frontend:**
```bash
cd ../Client
npm run dev
```

---

## 🔐 Authentication Flow

- **Sign Up:**  
  - User registers with email/password or Google.
  - User is created in Firebase Auth.
  - User data is also stored in Firestore under `users/{uid}`.

- **Login:**  
  - User logs in via Firebase Auth.
  - JWT token is used for backend API authentication.

- **Password Reset:**  
  - User requests reset; email is sent via Firebase Auth.

---

## 🗃️ Database Structure

### Firestore Collections

#### `users`
```json
{
  "email": "user@example.com",
  "displayName": "User Name",
  "avatarUrl": "https://...",
  "role": "user",
  "status": "active",
  "createdAt": "...",
  "lastLogin": "...",
  "provider": "google.com"
}
```

#### `posters`
```json
{
  "userId": "uid",
  "imageUrl": "https://...",
  "prompt": "...",
  "negativePrompt": "...",
  "style": "...",
  "aspectRatio": "...",
  "dimensions": "...",
  "seed": 123,
  "createdAt": "...",
  "metadata": {
    "campaign": "...",
    "priority": "..."
  }
}
```

---

## 📡 API Endpoints

### Auth

- `POST /api/auth/signup` – Register user
- `POST /api/auth/login` – Login user
- `POST /api/auth/forgot-password` – Send password reset email

### Users

- `GET /api/users` – List all users (admin)
- `DELETE /api/users/:id` – Delete user (admin)

### Posters

- `GET /api/posters` – List all posters
- `POST /api/posters` – Create new poster
- `DELETE /api/posters/:id` – Delete poster

---

## 💻 Frontend Features

- **Home:** Landing page, features, and showcase.
- **Sign Up / Login:** Email/password and Google auth.
- **Profile:** View and manage user info and assets.
- **Generator:** Generate AI posters with custom prompts and styles.
- **Gallery:** Browse all public assets.
- **Admin Dashboard:** User and asset management.

---

## 🛡️ Admin Features

- **User Management:**  
  - View, search, and delete users.
  - See all user details (avatar, email, role, status, etc.)

- **Asset Management:**  
  - View, search, and delete assets.
  - See all asset details (image, prompt, style, metadata, etc.)

- **Stats:**  
  - View platform stats and graphs.

---

## 🚀 Deployment

- **Frontend:** Deploy to Vercel, Netlify, or Firebase Hosting.
- **Backend:** Deploy to Google Cloud Run, Heroku, or similar.
- **Environment variables:** Set in your deployment platform.

---

## 🛠️ Troubleshooting

- **Email already in use:**  
  - User exists in Firebase Auth. Prompt user to log in instead.

- **User not in Firestore:**  
  - Make sure you add user data to Firestore after signup (see SignupForm).

- **API 404 errors:**  
  - Check your backend URL and endpoint paths.

- **Push declined on GitHub:**  
  - Check branch protection rules. Use Pull Requests.