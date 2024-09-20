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
    <form className='form-container' onSubmit={newPost}>
      <input type='title' required placeholder='title ' value={title} onChange={(e)=>setTitle(e.target.value)}/>
      <input type='summary' required min={"100"} placeholder='enter the summary ' value={summary} onChange={(e)=>setSummary(e.target.value)} />
      <input type='file' required  onChange={(e)=>setFile(e.target.files)}/>
        <ReactQuill  required modules={modules} formats={formats} value={content} onChange={(newValue)=>setContent(newValue)}/>
      <button type="submit">Create Post</button>
    </form>
  )
}

export default CreatePost
