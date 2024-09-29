import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context';

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  
  const logout = () => {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };

  // Fetch user profile when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((info) => setUserInfo(info));
    });
  }, [setUserInfo]); // Dependency on setUserInfo

  return (
    <header className="bg-sky-50 flex justify-between items-center px-8 py-4 shadow-lg">
      {/* Logo */}
      <Link
        className="font-mono text-cyan-600 text-4xl font-bold tracking-wide hover:text-cyan-800 transition duration-300"
        to="/"
      >
        Bloggy
      </Link>

      <nav className="flex items-center space-x-6">
        {/* Conditionally render based on user authentication status */}
        {userInfo?.username ? (
          <>
            <Link
              to="/createPost"
              className="text-cyan-600 font-semibold hover:text-cyan-800 transition duration-300"
            >
              Create Post
            </Link>
            <button
              onClick={logout}
              className="text-red-600 font-semibold cursor-pointer hover:text-red-800 transition duration-300"
            >
              LogOut
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="bg-cyan-400 text-white py-2 px-6 rounded-full border-2 border-black font-semibold hover:bg-cyan-500 transition duration-300"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="bg-cyan-400 text-white py-2 px-6 rounded-full border-2 border-black font-semibold hover:bg-cyan-500 transition duration-300"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
