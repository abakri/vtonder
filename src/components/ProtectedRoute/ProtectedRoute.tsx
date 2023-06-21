import React, { useEffect } from "react";
import { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import pb from "../../lib/pocketbase"
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
