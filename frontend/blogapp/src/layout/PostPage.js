import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/post/" + id)
      .then((res) => res.json())
      .then((info) => setPostInfo(info));
  }, [id]);

  if (!postInfo) {
    return "";
  }

  return (
    <div className='max-w-4xl mx-auto my-8 p-4 bg-[#f8f8f9] rounded-lg shadow-lg'>
      <div className='img mb-4'>
        <img
          className='w-full h-64 object-cover rounded-lg'
          src={`http://localhost:4000${postInfo.cover}`}
          alt={postInfo.title}
        />
      </div>
      <h1 className='text-3xl font-bold mb-4'>{postInfo.title}</h1>
      <div className='flex items-center space-x-4 text-gray-600 mb-6'>
        <time className='text-sm'>{new Date(postInfo.createdAt).toDateString()}</time>
        <span className='text-sm'>|</span>
        <span className='text-sm font-bold'>By {postInfo.author.username}</span>
      </div>
      <div
        className='prose max-w-none'
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}

export default PostPage;
