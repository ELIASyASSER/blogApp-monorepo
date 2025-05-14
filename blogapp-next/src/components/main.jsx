import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-950 flex items-center justify-center px-4">
      <div className="text-center text-white space-y-10 max-w-2xl">
        {/* Static Gradient Heading */}
        <h1 className="text-5xl md:text-6xl p-4 font-extrabold bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to Bloggy
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
          Chat smarter. Connect deeper. A shiny real-time chat app experience.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Link href="/login">
            <button className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
              Register Now
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
