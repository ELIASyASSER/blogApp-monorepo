"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Register() {
  const userRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const username = userRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (username.length <= 4) {
      await Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Username must be more than 4 characters",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (password.length <= 4) {
      await Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Password must be more than 4 characters",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Account Created Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/login");
      } else {
        await Swal.fire({
          position: "top-center",
          icon: "error",
          title: data.message || "Registration failed",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      await Swal.fire({
        position: "top-center",
        icon: "error",
        title: error.message || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={userRef}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={passwordRef}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
        <Link
          href="/login"
          className="mt-6 block text-md text-blue-500 underline text-center hover:text-blue-700 transition duration-300"
        >
          Already have an account? Log in now
        </Link>
      </div>
    </div>
  );
}