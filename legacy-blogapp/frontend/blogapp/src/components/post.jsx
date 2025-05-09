import React from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Post({ _id, title, summary, cover, createdAt, author }) {
  const time = new Date(createdAt).toDateString();

  return (
<>
  <div className='img'>
        <Link to={`/post/${_id}` } className='relative overflow-hidden'>
          <img
            className='w-full h-64 object-cover transition-opacity duration-300 hover:opacity-90  '
            src={`http://localhost:4000${cover}`}
            alt='Post Cover'
          />
          <FaEye className='eye bg-[rgba(0,0,0,0.5)] text-white  hover:text-blue-500  m-auto rounded-lg ' />
        </Link>
      </div>
      <div className='p-6'>
        <Link to={`/post/${_id}`}>
          <h2 className='text-3xl truncate font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors duration-300'>
            {title}
          </h2>
        </Link>
        <div className='flex items-center space-x-4 text-gray-400 text-sm mb-4'>
          <span className='author font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300'>
            {author.username}
          </span>
          <time className='italic'>{time}</time>
        </div>
        <p className='text-gray-700 leading-relaxed theSummary'>{summary}</p>
      </div>
      </>

  );
}

export default Post;
