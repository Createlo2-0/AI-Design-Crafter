// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { UserAssetsProvider } from './contexts/UserAssetsContext.jsx'; // <<<--- IMPORTED

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <UserAssetsProvider> {/* <<<--- ADDED WRAPPER */}
          <App />
        </UserAssetsProvider>
    </BrowserRouter>
  </React.StrictMode>
);