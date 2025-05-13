"use client"
import { useUser } from '@/context/context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { useUser } from '../context/context';
import Swal from 'sweetalert2'


function Login() {
  const  {profileUser} = useUser()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const router = useRouter()
  const login = async (e) => {
    try {
        
        
        e.preventDefault();
    
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        
        if (res.status ==201) {
          profileUser()
          setRedirect(true);
        } else {
            console.log(res)
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: "Wrong Information",
            showConfirmButton: false,
            timer: 2000
        });
    }
    
    
    } catch (error) {
        setRedirect(false)
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: error.message||"Wrong Information",
            showConfirmButton: false,
            timer: 2000
        });
        
        
    }
}


useEffect(() => {
  if (redirect) {
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Logged In Successfully",
      showConfirmButton: false,
      timer: 2000,
    });
    router.push("/");
  }
}, [redirect, router]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <form className="space-y-4" onSubmit={login}>
          <div>
            
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition duration-300"
          >
            Log In
          </button>
        </form>
        <Link href={'/register'} className='mt-6 block text-md text-blue-500 underline'>Don't Have Account Sign Up Now</Link>

      </div>
    </div>
  );
}

export default Login;
