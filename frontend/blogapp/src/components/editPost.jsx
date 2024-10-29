import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate ,useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
function EditPost() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [redirect,setRedirect] = useState(false)
    const [title,setTitle] = useState("")
    
    const [summary,setSummary] = useState("")
    const [content,setContent] = useState("")
    const [file,setFile] = useState("")

    const modules= {toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    
      ]}
    
      const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];

      React.useEffect(()=>{
        fetch('http://localhost:4000/post/'+id).then(info=>info.json()).then(data=>{
            setTitle(data.title)
            setContent(data.content)
            setSummary(data.summary)
            setFile(data.cover)


        })
        

      },[])





  async function editPost(e){
    e.preventDefault()
    const data = new FormData()
    data.set("title",title)
    data.set("content",content)
    data.set("id",id)
    data.set("summary",summary)
    data.set("file",file[0])
    const res =  await fetch("http://localhost:4000/post",{
        method:"PUT",
        body:data,
        credentials:"include"
    })
    if (res.ok){
      const handleQuill = (value)=>{

        const textContent = value.replace(/<[^>]+>/g, ''); 
        if(textContent.length <= 500){
          setRedirect(false)
          Swal.fire({
            title: "Content Error",
            text: `Content must be at least 500 characters. Current length: ${textContent.length}`,
            icon: "question"
          });
          
        }
        else{
          setContent(value)
          setRedirect(true)
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Post Edited Successfully",
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
        handleQuill(content)
    }
    else{
      const info = await res.json()
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: info.error ==='jwt must be provided'?"please enter your information":info.error,

      });
      navigate("/")
    }

  }
  if(redirect){
    return <Navigate to={'/'}/>
  }

    return (
  
      <form className='form-container m-8 bg-white p-3 overflow-hidden shadow-md  rounded-lg p-6 space-y-6 min-h-min' onSubmit={editPost}>
      {/* Title Input */}
      <input
        type='text'
        required
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
      />
      
      {/* Summary Input */}
      <textarea
        required
        placeholder='Enter the summary (min 150 characters)'
        minLength="150"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg overflow-hidden min-h-min focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none '
      />
      
      {/* File Input */}
      <input
        type='file'
        required
        onChange={(e) => setFile(e.target.files)}
        className='w-full px-4 py-2 text-gray-600 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500'
      />
      
      {/* React Quill Editor */}
      <ReactQuill
        required
        modules={modules}
        formats={formats}
        value={content}
        onChange={(newValue) => setContent(newValue)}
        className='w-full h-64 mb-10  overflow-hidden '
      />
      
      {/* Submit Button */}
      <button
        type='submit'
        className='w-4/5 block mx-auto bg-green-500 m-5 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300'
      >
        Edit Post
      </button>
      
    </form>
    
  )
}

export default EditPost
