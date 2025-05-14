"use client";
import { useContext, createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

export const UserContext = createContext({});

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser,setLoadinguser] = useState(false)
  // Function to handle errors and display Swal messages
  const showError = (message) => {
    Swal.fire({
      position: "top-center",
      icon: "error",
      title: message || "Something went wrong, please try again later...",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Fetch the user profile from the API
  const profileUser = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/profile", { credentials: "include" });

      if (res.status === 200) {
        const info = await res.json();
        setUser(info?.data);
        localStorage.setItem("user", JSON.stringify(info?.data));
      } else {
        showError("Failed to fetch user profile.");
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.log("Error fetching user:", err);
      showError();
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logoutUser = async () => {
    setLoading(true);

    try {
      await fetch("/api/logout", {
        credentials: "include",
        method: "POST",
      });

      setUser(null);
      localStorage.removeItem("user");

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Logged Out Successfully",
        showConfirmButton: false,
        timer: 3500,
      });
    } catch (err) {
      showError("Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  // Check if the user is logged in based on localStorage or API
  const areYouLogged = () => {
    return user !== null;
  };

  // On initial mount, check localStorage for user and fetch profile if not available
  useEffect(() => {
    setLoadinguser(true)
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      profileUser().finally(()=>setLoadinguser(false)); // Fetch user profile if no user in localStorage
    }
  }, []);

  // The context value
  const value = {
    profileUser,
    logoutUser,
    modalOpen,
    setModalOpen,
    loading,
    setLoading,
    user,
    setUser,
    areYouLogged,
    setLoadinguser,
    loadingUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
