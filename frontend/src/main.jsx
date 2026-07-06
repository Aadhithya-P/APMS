import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  NotificationProvider,
} from "./context/NotificationContext";

import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);