import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "./Auth";
import Dashboard from "./Dashboard";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { logout, setCredentials } from "./store/slices/authSlice";

const router = createBrowserRouter([
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

function App() {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setCredentials(session.user));
      }
      setIsAuthChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setCredentials(session.user));
      } else {
        dispatch(logout());
      }
      setIsAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (isAuthChecking) {
    return <div className="h-screen w-screen bg-white" />;
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
