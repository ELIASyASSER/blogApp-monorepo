import React, { useEffect, useRef, useState } from 'react';
import Alert from './alert';

function Register() {
    const [error,setError] = useState(false)
    const [register,setRegister] = useState(false)
    const userRef = useRef(null)
    const passwordRef = useRef(null)


    const registeration = async(e)=>{
        e.preventDefault()
            if(userRef.current.value.length<=4 ){
                setError(true)
                alert(" username  must be more than 4 characters")
                return
            }
            else if( passwordRef.current.value.length<=4){
                setError(true)
                alert(" password must be more than 4 characters")
                return
            }
            else{
                setError(false)
                const username = userRef.current.value
                const password = passwordRef.current.value
                try {
                   const res =  await fetch("http://localhost:4000/register",{
                    method:"POST",
                    body:JSON.stringify({username,password}),
                    headers:{'Content-Type':'application/json'}
                })
                if(res.status === 200){
                    setRegister(true)
                }
                else{
                    setRegister(false)
                    alert("User Name should be differnt")
                    
                }
                } catch (error) {
                    alert("Regiseration field please try again")
                }
    }
    }
    const removeAlert =()=>{
        setRegister(false)
    }
  return (
    <>
    <h1> Register</h1>
    {register&&<Alert alert={removeAlert}/>}
      <form className="signup-form" onSubmit={registeration}>
        <input type="text" placeholder="Username" className={`signup-input ${error &&'error'}`}  ref={userRef} />
        <input type="password" placeholder="Password" className={`signup-input ${error &&'error'}`} ref={passwordRef}/>

        <button className="signup-button" type='submit'> Register</button>
      </form>
    </>
  );
}

export default Register;
