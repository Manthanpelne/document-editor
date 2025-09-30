import { useState } from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Editor } from "./pages/Editor";
import ProtectedRoute from "./components/ProtectedRoute";

export const API_BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <>
    
       <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            {/* Public Route for Login/Register */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/document/:id" element={<Editor />} />
            </Route>

            {/* Optional: Add a 404 page */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
