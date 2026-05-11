
import { createRoot } from "react-dom/client";
import App from "./App";
import "./features/offer-letter/styles/global.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </BrowserRouter>

);