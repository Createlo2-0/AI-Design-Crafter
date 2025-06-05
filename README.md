# DesignCrafter.AI

A full-stack AI-powered poster and asset generation platform.

---

## 🚀 Getting Started

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

3. **Create a `.env` file in the `Server` folder with your Firebase Admin credentials:**
    ```
    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY=
    PORT=5000
    ```

4. **Start the backend server:**
    ```bash
    nodemon index.js
    ```