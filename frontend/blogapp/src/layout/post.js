import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import img1 from '../assets/cat-01.jpg'

function Post({_id,title,summary,cover,content,createdAt,author}) {
  const time = new Date(createdAt).toDateString()
  return (
    <div className='post'>
      <div className='img'>
      <Link to={`/post/${_id}`}>
      <img src={"http://localhost:4000/"+cover} alt='img'/>
      </Link>
      </div>
      <div className='text'>
        <Link to={`/post/${_id}`}>
      <h2>{title}</h2>
        </Link>
        <p className='info'> 
          <a className='author'>{author.username}</a>
          <time>{time}</time>
        </p>

        <p>{summary}</p>
      </div>
</div>
  )
}

export default Post
