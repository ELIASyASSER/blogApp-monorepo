import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: loading, true: logged in, false: not logged in

  useEffect(() => {
    
    const checkLoginStatus = async () => {
      try {
        const resp = await fetch("http://localhost:4000/isLogged", {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await resp.json();
        const isLoggedIn = Boolean(data.logged); // Assuming 'logged' is a boolean indicating login status
        setIsLoggedIn(isLoggedIn);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false); // If there's an error in the fetch, assume user is not logged in
      }
    };

    checkLoginStatus();
  }, []);

  // While the request is in progress, render nothing or a loading spinner
  if (isLoggedIn === null) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner or message
  }
  

  // If the user is logged in, render the protected routes; otherwise, redirect to login
  if (isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
