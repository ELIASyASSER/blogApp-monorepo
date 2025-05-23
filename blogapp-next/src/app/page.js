"use client"; // Needed if this is inside `app/` and using hooks
import { Suspense, useEffect, useState } from 'react';

import Post from '@/components/post';
import Swal from 'sweetalert2';
import Loading from './loading';
import Main from '@/components/main';
import { useUser } from '@/context/context';

  // Fetch posts
export default function Home() {
  const { user, userLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      fetch("/api/allPosts")
        .then(res => res.json())
        .then(data => {
          setPosts(data);
          setLoadingPosts(false);
        })
        .catch(err => {
          console.error("Failed to fetch posts:", err.message);
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: err.message,
            showConfirmButton: false,
            timer: 2000,
          });
          setLoadingPosts(false);
        });
    }
  }, [userLoading, user]); // Re-run when user loads

  if (userLoading) return <Loading />;

  if (!user) return <Main />;

  if (loadingPosts) return <Loading />;

  return (
    <main className='grid md:grid-cols-2 gap-5 overflow-hidden'>
      {posts.map((post, idx) => (
        <div
          key={idx}
          className='post bg-white rounded-lg shadow-lg mb-8 transition-transform container m-4 mx-auto md:w-[45vw] overflow-hidden'
        >
          <Suspense fallback={<Loading />}>
            <Post {...post} />
          </Suspense>
        </div>
      ))}
    </main>
  );
}
