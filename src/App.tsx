import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./Auth";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Auth mode="login" /> },
      { path: "login", element: <Auth mode="login" /> },
      { path: "register", element: <Auth mode="register" /> }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
