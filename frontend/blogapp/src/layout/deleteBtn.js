import React from 'react'
import {UserContext} from '../context'
import { Navigate } from 'react-router-dom'
function DeleteButton({id}) {
    const [redirect,setRedirect] = React.useState(false)
    const handleDelete = async()=>{
        
        const res = await fetch('http://localhost:4000/delete',{
            method:"DELETE",
            body:JSON.stringify({id}),
            headers:{"Content-Type":"application/json"},
            credentials:"include"

        })
        if(res.ok){
            setRedirect(true)
            
        }

    } 


    if(redirect){
        return <Navigate to={'/'}/>
    }


    return (
            <button onClick={handleDelete} className='text-white bg-red-600 px-8 py-4 font-mono uppercase m-4 rounded-lg shadow-lg  transition hover:bg-orange-700'>delete </button>
        )
}

export default DeleteButton
