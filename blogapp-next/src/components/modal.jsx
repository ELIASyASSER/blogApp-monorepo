"use client"
import { useUser } from "@/context/context";
import { FaTimes } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';  // Use Next.js useRouter
import Swal from 'sweetalert2';

const Modal = () => {
  const { setModalOpen } = useUser();
  const router = useRouter();  // Use Next.js router
  const {id}= useParams()
  async function handleDelete() {
    
    const resp = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      const data = await resp.json();
      Swal.fire({
        icon: "error",
        title: "Oops something went wrong while deleting...",
        text: data.error === 'jwt must be provided' ? "Please enter your information" : data.error,
      });
      console.log('error is',data)
      setModalOpen(false);
      router.push('/');  // Use Next.js router to navigate
    } else {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Post Deleted Successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      router.push('/');  // Use Next.js router to navigate
      setModalOpen(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 shadow-lg max-w-md w-full rounded-xl relative">
        <button
          className="bg-red-700 hover:bg-red-600 text-white p-3 font-bold rounded-full absolute -top-3 -left-3"
          onClick={() => { setModalOpen(false); }}
        >
          <FaTimes />
        </button>
        <p className="mb-6">
          Do You Want To Delete This Post?
          <br />
          <span className="text-slate-600 text-[12px]">You Can't Restore It Again ??</span>
        </p>
        <button
          className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleDelete}
        >
          Confirm
        </button>
        <button
          className="bg-red-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600 ml-5"
          onClick={() => { setModalOpen(false); }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
