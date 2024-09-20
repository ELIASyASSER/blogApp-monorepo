import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostPage() {
    const {id} = useParams()
    const [postInfo,setPostInfo] = useState(null)
    useEffect(()=>{
        fetch("http://localhost:4000/post/"+id).then(res=>res.json().then(info=>setPostInfo(info)))
        
      },[])

    
    if(!postInfo){
        return ""
    }

  return (
    <div className='post'>
    <div className='img'>
        <img src={`http://localhost:4000/${postInfo.cover}`}/>
    </div>
    <h1>{postInfo.title}</h1>
    <time>{new Date(postInfo.createdAt).toDateString()}</time>
    <div className='author'>{postInfo.author}</div>
    <div dangerouslySetInnerHTML={{__html:postInfo.content}}/>
    </div>
  )
}

export default PostPage
