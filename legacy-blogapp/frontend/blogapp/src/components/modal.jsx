// Modal.js
import React from 'react';
import { useUser} from "../context/context";
import { FaTimes } from 'react-icons/fa';
import {useNavigate, useParams}from "react-router-dom"
import Swal from 'sweetalert2';
const Modal = () => {
  const {setModalOpen} = useUser()
  const navigate= useNavigate()
  
  const {id} = useParams()

  async function handleDelete() {
    
    const resp = await fetch(`http://localhost:4000/post/${id}`,{
      method:"DELETE",
      credentials:"include",
      headers:{"Content-Type":"application/json"}
    })
    if(!resp.ok){
      const data = await resp.json()
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.error ==='jwt must be provided'?"please enter your information":data.error,

      });
      setModalOpen(false)
      navigate('/')
    }
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Post Deleted Successfully",
      showConfirmButton: false,
      timer: 2000
    });
    
    navigate("/")  
    setModalOpen(false)

  }


return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50  flex justify-center items-center">
      <div className="bg-white p-8  shadow-lg max-w-md w-full rounded-xl relative">
      <button className='bg-red-700 hover:bg-red-600 text-white p-3 font-bold rounded-full absolute -top-3 -left-3' onClick={()=>{setModalOpen(false)}}><FaTimes/></button>
        <p className="mb-6 ">Do You Want To delete This Post < br/><span className='text-slate-600 text-[12px]'> You Cant Restore It Again ??</span> </p> 
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleDelete}>
          Confirm
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 ml-5"
          onClick={()=>{setModalOpen(false)}}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
