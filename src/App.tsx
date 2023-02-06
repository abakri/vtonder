import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppController } from "./components/AppController/AppController";
import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Login } from "./containers/Login/Login";
import { Sessions } from "./containers/Sessions/Sessions";

export const App: React.FC<{}> = () => {
    return (
        <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path=":sessionId/form" element={<ProfileForm />} />
            <Route path="dashboard" element={
                <ProtectedRoute>
                    <Sessions />
                </ProtectedRoute>
            } />
            <Route path=":sessionId/swipe" element={
                <ProtectedRoute>
                    <AppController />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App