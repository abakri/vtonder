import React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import pb from "../../lib/pocketbase"

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (!pb.authStore.isValid) {
        return <Navigate to="/login" />
    }
    return <>{children}</>
}