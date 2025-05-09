import React, { useEffect, useRef, useState } from 'react';
import { Navigate ,Link} from 'react-router-dom';
import Swal from 'sweetalert2';
function Register() {
    const [error, setError] = useState(false);
    const [register, setRegister] = useState(false);
    const userRef = useRef(null);
    const passwordRef = useRef(null);

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
                const res = await fetch("http://localhost:4000/register", {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const data =await res.json()
                if (res.status === 200) {
                    setRegister(true);
                } else {
                    setRegister(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Registration failed, please try another information",
                });
                }

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Registration failed, please try again",
                });
                
            }
        }
    };



    if (register) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                <form className="space-y-4" onSubmit={registeration}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                            ref={userRef}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                            ref={passwordRef}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <Link to={'/login'} className='mt-6 block text-md text-blue-500 underline'>Have Account  LogIn Now</Link>
            </div>
        </div>
    );
}

export default Register;
