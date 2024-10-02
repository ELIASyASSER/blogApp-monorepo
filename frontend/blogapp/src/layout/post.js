import React from 'react';
import { Link } from 'react-router-dom';

function Post({ _id, title, summary, cover, createdAt, author }) {
  const time = new Date(createdAt).toDateString();

  return (
    <div className='post bg-white rounded-lg shadow-lg overflow-hidden mb-8 transition-transform '>
      <div className='img'>
        <Link to={`/post/${_id}`}>
          <img
            className='w-full h-64 object-cover transition-opacity duration-300 hover:opacity-90'
            src={`http://localhost:4000${cover}`}
            alt='Post Cover'
          />
        </Link>
      </div>
      <div className='p-6'>
        <Link to={`/post/${_id}`}>
          <h2 className='text-3xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors duration-300'>
            {title}
          </h2>
        </Link>
        <div className='flex items-center space-x-4 text-gray-400 text-sm mb-4'>
          <span className='author font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300'>
            {author.username}
          </span>
          <time className='italic'>{time}</time>
        </div>
        <p className='text-gray-700 leading-relaxed'>{summary}</p>
      </div>
    </div>
  );
}

export default Post;
