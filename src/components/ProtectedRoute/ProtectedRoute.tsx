import React, { useEffect } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login")
    });
  }, []);
  return <>{children}</>
}
