import React from 'react'
import Post from './post'

function Home() {
  const [posts,setPosts] =React.useState([])
  React.useEffect(() => {
    fetch("http://localhost:4000/post").then(res=>res.json().then(posts=>{
      setPosts(posts)
    }
    ))

  }, [])
  
    
  return (
    <>
    
    {posts.length >0 && posts.map((post)=>{
      return <Post {...post}/>
    })}
    </>
  )
}

export default Home