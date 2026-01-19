import {  RouterProvider } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { logout, setSession } from "./store/slices/authSlice";
import { router } from "./Router";

function App() {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setSession(session));
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
