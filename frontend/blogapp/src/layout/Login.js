import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'
function Login() {
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [redirect,setRedirect] = useState(false)
  const  login = async(e) =>{
    e.preventDefault()
      const res =  await fetch("http://localhost:4000/login",{
        method:"POST",
        body:JSON.stringify({username,password}),
        headers:{"Content-Type":"application/json"},
        credentials:"include",
      
      })
      if(res.ok){
        setRedirect(true)
      }else {
        alert("Wrong Credintials")
        
      
    } 
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  
  return (
    
    <>
    <h1>Log In</h1>
      <form className="login-form" onSubmit={login}>
        <input type="text" placeholder="Username" className="login-input" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" className="login-input" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button className="login-button">Log In</button>
      </form>
    </>
  );
}

export default Login;
