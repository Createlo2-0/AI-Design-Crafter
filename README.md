# AI Design Crafter

A full-stack application for generating and managing AI-powered images.

---

## 🚀 Deployment Overview

- **Frontend:** [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Backend:** [Google Cloud Platform (GCP)](https://cloud.google.com/)
- **Image Generation:** [Google Vertex AI](https://cloud.google.com/vertex-ai) (using multiple models)

---

## 🖼️ Image Generation Models

The backend uses the following Vertex AI models for image generation, in order of preference:

```js
  "imagen-4.0-generate-preview-06-06", // Highest quality, try first
  "imagen-3.0-generate-preview-06-05", // Excellent fallback
  "imagegeneration@006", // A stable, older version
```

If the first model fails (e.g., due to quota), the next is tried automatically.

---

## 📝 How to Use

### 1. **Frontend (Firebase Hosting)**

- The frontend is built with React.
- It is deployed to Firebase Hosting.
- To deploy updates:
  ```sh
  cd Client
  npm install
  npm run build
  firebase deploy
  ```

### 2. **Backend (GCP)**

- The backend is a Node.js server deployed on Google Cloud (Compute Engine, App Engine, or Cloud Run).
- To deploy updates:
  -gcloud run deploy service_name --source . --region "region_name" --allow-unauthenticated --set-env-vars "FIREBASE_PROJECT_ID=project_id,FIREBASE_CLIENT_EMAIL=firebase_client_email,GCLOUD_PROJECT=GCP_project_name,GCS_BUCKET=GCS_bucket_name"

### 3. **Image Generation**

- When a user requests an image, the backend calls Vertex AI using the models listed above.
- The backend automatically falls back to the next model if one fails.

---

## 🛠️ Local Development

### Frontend

```sh
cd Client
npm install
npm start
```

### Backend

```sh
cd Server
npm install
node index.js or nodemon index.js
```

---

## 🌐 Environment Variables

**Backend:**

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `VERTEX_KEY_PATH` (path to your Vertex AI service account key)
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GCS_BUCKET`
- `GCLOUD_PROJECT`
- `GEMINI_API_KEY`
- `PORT`

**Frontend:**

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

---

## 📦 Tech Stack

- **Frontend:** ReactJS, Tailwindcss, Firebase Auth, Framer Motion, GSAP
- **Backend:** Node.js, Express, Firebase,GCP
- **AI:** Google Vertex AI (Imagen models)

---