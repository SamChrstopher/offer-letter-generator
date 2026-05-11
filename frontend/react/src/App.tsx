import { Routes, Route } from "react-router-dom";

import Selection from "./pages/Selection";
import Home from "./pages/Home";
import Results from "./features/offer-letter/components/Results";
import FormPage from "./pages/FormPage";
import Navbar from "./pages/Navbar";

import LoginPage from "./features/auth/pages/LoginPage";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import MyOfferLetters from "./pages/MyOfferLetters";
import { useEffect } from "react";
import { toast } from "react-toastify";

import ForgotPasswordForm from "./features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "./features/auth/components/ResetPasswordForm";

function App() {
  useEffect(() => {
    const handler = () => {
      toast.warning("Session expired. Please login again.", {
        toastId: "session-expired",
      });
    };

    window.addEventListener("session-expired", handler);

    return () => {
      window.removeEventListener("session-expired", handler);
    };
  }, []);

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Selection />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <FormPage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/excel"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Home />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-offerletters"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MyOfferLetters />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Results />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
