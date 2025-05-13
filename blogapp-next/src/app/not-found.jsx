import Link from "next/link"

const NotFoundPage = () => {
  return (
    <div className='lg:text-7xl text-5xl font-mono flex justify-center items-center h-screen flex-col text-center '>
        <span className='text-red-600 mb-9 '>Oops!!</span>
        <div className='leading-relaxed'>Error 404 This Page Not Found</div>
        <Link href={'/'} className='text-4xl mt-20 text-white bg-sky-500 px-4 py-3 hover:bg-blue-500 rounded-md'>Back Home</Link>
    </div>
  )
}

export default NotFoundPage