import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.css'
import { Navigate } from 'react-router-dom'
function CreatePost() {
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
  async function newPost(e){
    
    const data = new FormData()
    data.set("title",title)
    data.set("summary",summary)
    data.set("content",content)
    data.set("file",file[0])
    e.preventDefault()
    const res = await fetch("http://localhost:4000/createPost",{
        method:"POST",
        credentials:"include",
        body:data
    })
    if(res.ok){
      setRedirect(true)
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }

    return (
      <form className='form-container bg-white shadow-md rounded-lg p-6 space-y-6' onSubmit={newPost}>
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
        placeholder='Enter the summary (min 100 characters)'
        minLength="100"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
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
        className='w-full h-64 mb-4'
      />
      
      {/* Submit Button */}
      <button
        type='submit'
        className='w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300'
      >
        Create Post
      </button>
      
    </form>
    
  )
}

export default CreatePost
