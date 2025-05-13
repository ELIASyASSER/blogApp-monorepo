"use client";

import { useUser } from '@/context/context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Login() {
  const { profileUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showAlert = async ({ icon, title }) => {
    const Swal = (await import('sweetalert2')).default;
    Swal.fire({
      position: "top-center",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 201) {
        profileUser();
        showAlert({ icon: 'success', title: 'Logged In Successfully' });
        router.push("/");
      } else {
        showAlert({ icon: 'error', title: 'Wrong Information' });
      }
    } catch (error) {
      showAlert({ icon: 'error', title: error.message || 'Login failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <form className="space-y-4" onSubmit={login}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition duration-300 cursor-pointer"
          >
            Log In
          </button>
        </form>
        <Link href="/register" className="mt-6 block text-md text-blue-500 underline">
          Don't Have Account? Sign Up Now
        </Link>
      </div>
    </div>
  );
}

export default Login;
