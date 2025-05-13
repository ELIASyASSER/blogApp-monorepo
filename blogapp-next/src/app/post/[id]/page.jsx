'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPen, FaTrash } from 'react-icons/fa';
import { useUser } from '@/context/context'; // Adjust path to your context
import Modal from '@/components/modal';       // Adjust path
import Loading from '@/app/loading';

function PostPage() {
  const { modalOpen, setModalOpen,loading,setLoading,areYouLogged} = useUser();
  const [show, setShow] = useState(true);
  const [logged,setLogged] = useState(null)
  const [postInfo, setPostInfo] = useState(null);

  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  useEffect(() => {
    if (!id) return;
    fetch(`/api/post/${id}`) // Make sure this route is implemented in Next.js API routes or app/api
      .then(res => res.json())
      .then(data => setPostInfo(data))
      .catch(err => console.error(err));
    
    }, [id]);

    
    

    
  useEffect(()=>{
    const checkLogin = ()=>{
      setLoading(true)

      if(areYouLogged()){
        setLogged(true)
      }else{
        setLogged(false)
      }
    }
    checkLogin()
    setLoading(false)
  },[])


  useEffect(()=>{
    if(logged ==false){
      router.replace("/login")
    }
  },[logged])


  if (!postInfo || loading) return <Loading/>;

  if(logged){
    return (
    <div className='max-w-5xl mx-auto my-8 p-4 bg-[#f8f8f9] rounded-lg shadow-lg'>
      <div className='mb-4'>
        <img
          className='w-full h-64 object-cover rounded-lg'
          src={`${postInfo.cover}`} // Assuming the image is in /public/uploads
          alt={postInfo.title}
        />
      </div>

      <h1 className='text-3xl font-bold mb-4 break-words'>{postInfo.title}</h1>

      <div className='flex items-center space-x-4 text-gray-600 mb-6'>
        <time className='text-sm'>{new Date(postInfo.createdAt).toDateString()}</time>
        <span className='text-sm'>|</span>
        <span className='text-sm font-bold'>By {postInfo.author.username}</span>
      </div>

      {show ? (
        <>
          <div
            className='max-w-none break-words leading-loose font-bold'
            dangerouslySetInnerHTML={{
              __html: postInfo.content.slice(0, postInfo.content.length / 2),
            }}
          />
          <button className='text-blue-600 underline' onClick={() => setShow(false)}>
            Show More
          </button>
        </>
      ) : (
        <>
          <div
            className='max-w-none break-words leading-loose font-bold'
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
          <button className='text-blue-600 underline' onClick={() => setShow(true)}>
            Show Less
          </button>
        </>
      )}

      <div className='flex justify-center items-center mt-6'>
        <Link
          href={`/editPost/${postInfo._id}`}
          className='bg-black text-white px-6 py-4 rounded-lg font-semibold my-4 w-fit flex items-center'
        >
          <FaPen />
        </Link>

        <button
          className='text-white bg-red-600 px-6 py-4 cursor-pointer font-mono uppercase m-4 rounded-lg shadow-lg transition hover:bg-orange-700 flex items-center'
          onClick={() => setModalOpen(true)}
        >
          <FaTrash />
        </button>
      </div>

      {modalOpen && <Modal />}
    </div>
    );
  }
  if(!logged){
    return null;
  }












 
}

export default PostPage;
