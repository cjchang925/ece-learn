import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="814398908829-ev3belrqio4b67tp8anlhut0iihr5pb4.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
