"use client"
import { useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import Link from 'next/link';

function Register() {
    const [error, setError] = useState(false);
    const [register, setRegister] = useState(false);
    const userRef = useRef(null);
    const passwordRef = useRef(null);
    const router = useRouter();

    const registeration = async (e) => {
        e.preventDefault();
        if (userRef.current.value.length <= 4) {
            setError(true);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Username must be more than 4 characters",
            });
        } else if (passwordRef.current.value.length <= 4) {
            setError(true);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password must be more than 4 characters",
            });
        } else {
            setError(false);
            const username = userRef.current.value;
            const password = passwordRef.current.value;
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (res.status === 201) {
                    Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Post Created Successfully",
                    showConfirmButton: false,
                    timer: 2000
                    });
                    setRegister(true);

                } else {
                    setRegister(false);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: res.message||"Registration failed, please try another information",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: res.message||"Registration failed, please try again",
                });
            }
        }
    };

    if (register) {
        router.push("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform ease-in-out duration-500 hover:scale-105 hover:shadow-xl">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 animate__animated animate__fadeIn animate__delay-1s">Create an Account</h1>
                <form className="space-y-6" onSubmit={registeration}>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Username"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out`}
                            ref={userRef}
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out`}
                            ref={passwordRef}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        Register
                    </button>
                </form>
                <Link href={'/login'} className="mt-6 block text-md text-blue-500 underline text-center hover:text-blue-700 transition duration-300">
                    Already have an account? Log in now
                </Link>
            </div>
        </div>
    );
}

export default Register;
