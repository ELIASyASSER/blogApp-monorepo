import React from 'react'
import Post from './post'

function Home() {
  const [posts,setPosts] =React.useState([])

  React.useMemo(() => {
    fetch("http://localhost:4000/post").then(res=>res.json().then(posts=>{
      setPosts(posts)
    }
    ))

  }, [])
  

  return (
    <main className='grid md:grid-cols-2  gap-5 overflow-hidden '>
    {posts.length >0 && posts.map((post,idx)=>{
      return(
        
        <div key={idx} className='post bg-white rounded-lg shadow-lg  mb-8 transition-transform container m-4 mx-auto  md:w-[45vw] overflow-hidden'>
          <Post {...post} />
        </div>
      ) 
    })}
    </main>
  )
}

export default Home