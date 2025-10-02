// src/pages/Logout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem("auth_token"); // limpia tu token
    } finally {

      navigate("/reportesApp", { replace: true });

    }
  }, [navigate]);

  return null;
}
