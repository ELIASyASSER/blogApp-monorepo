
"use client"; // Needed if this is inside `app/` and using hooks
import { useEffect, useState } from 'react';

import Post from '@/components/post';
import Swal from 'sweetalert2';

export default function Home() {  
    
  const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      fetch("/api/allPosts")
        .then(res => res.json())
        .then(data => 
          setPosts(data)
        )
        .catch(err => {
          console.error("Failed to fetch posts:", err.message);
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: err.message,
              showConfirmButton: false,
              timer: 2000
            });
        });
    }, []);
  
    return (

      <main className='grid md:grid-cols-2 gap-5 overflow-hidden'>
        {posts.length > 0 && posts.map((post, idx) => (
          <div
            key={idx}
            className='post bg-white rounded-lg shadow-lg mb-8 transition-transform container m-4 mx-auto md:w-[45vw] overflow-hidden'
          >
            <Post {...post} />
          </div>
        ))}
 
 
      </main>
    );
}