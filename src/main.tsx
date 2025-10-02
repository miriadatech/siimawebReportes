import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './index.css'
import App from './App.tsx'
import "antd/dist/reset.css";
import "./styles/fix-sider.css";


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/reportesApp">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
