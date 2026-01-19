import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Auth mode="login" /> },
      { path: "register", element: <Auth mode="register" /> },
      { path: "dashboard", element: <Dashboard /> }
    ]
  }
])