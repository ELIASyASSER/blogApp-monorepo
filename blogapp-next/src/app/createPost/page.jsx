"use client"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState ,useEffect} from 'react'
import Swal from 'sweetalert2'
import 'react-quill-new/dist/quill.snow.css'
import { useUser } from '@/context/context'
import Loading from '../loading'

export const metadata = {
   
  title: "create post page",
  description: "you can create your post in this page and share your ideas to the world ",
};

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });


function CreatePost() {
  const router = useRouter(); 
  const [redirect, setRedirect] = useState(false)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null) // This will store the file
  const {loading,setLoading,areYouLogged} = useUser()
  const [logged,setLogged] = useState(null)
  


  const modules = {

    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 
    'link', 'image'
  ];



  async function newPost(e) {
    e.preventDefault()

    // Validate content length
    const plainText = content.replace(/<[^>]+>/g, '')
    if (plainText.length < 500) {
      Swal.fire({
        title: "Content Too Short",
        text: `Content must be at least 500 characters. Current length: ${plainText.length}`,
        icon: "warning"
      });
      return;
    }

    // Check if file is selected
    if (!file) {
      Swal.fire({
        title: "File Missing",
        text: "Please select an image file before submitting.",
        icon: "warning"
      });
      return;
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", file); // Add the file to FormData

    try {
      setLoading(true)
      const res = await fetch("/api/createPost", {
        method: "POST",
        credentials: "include",
        body: data
      });

      if (res.status == 201) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Post Created Successfully",
          showConfirmButton: false,
          timer: 2000
        });
        setLoading(false)
        setRedirect(true);
      } else {
        const errorData = await res.json();
        Swal.fire({
          title: "Error",
          text: errorData.message || "Something went wrong. Try again.",
          icon: "error"
        });
        setLoading(false)
      }
    } catch (err) {
      Swal.fire({
        title: "Network Error",
        text: "Failed to connect to server.",
        icon: "error"
      });
      setLoading(false)
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

  if(loading )return <Loading/>

  if(logged == false){
    return null
  }
  if(logged){
    return <form
      className='form-container m-8 bg-white overflow-hidden shadow-md rounded-lg p-6 space-y-6 min-h-min'
      onSubmit={newPost}
    >
      <input
        type='text'
        required
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-4/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
      />

      <textarea
        required
        placeholder='Enter the summary (min 150 characters)'
        minLength="150"
        maxLength="500"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
      />

      <input
        type='file'
        required
        accept="image/*"
        onChange={(e) => {
          console.log('File selected:', e.target.files[0]); // Debug log
          setFile(e.target.files[0]); // Store the file directly
        }}
        className='w-full px-4 py-2 text-gray-600 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500'
      />

      <ReactQuill
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
        className='w-full h-64 mb-10 overflow-auto'
      />

      <button
        type='submit'
        className={`w-full cursor-pointer bg-blue-500 m-5 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 ${loading?"opacity-30 pointer-events-none":""}`}
      >
        {loading?"creating":"create Post"}
      </button>
    </form>
  
  }

  
  
}

export default CreatePost