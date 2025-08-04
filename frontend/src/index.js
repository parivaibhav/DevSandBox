import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const googleId = process.env.REACT_APP_GOOGLE_CLIENTID;

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleId}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/code/:filename" element={<App />} />
            <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
