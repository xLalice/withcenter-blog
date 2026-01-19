import { createBrowserRouter } from "react-router-dom";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Auth mode="login" /> },
      { path: "login", element: <Auth mode="login" /> },
      { path: "register", element: <Auth mode="register" /> },
      { path: "dashboard", element: <Dashboard /> }
    ]
  }
])