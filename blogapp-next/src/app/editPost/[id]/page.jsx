"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useUser } from "@/context/context";
import Loading from "@/app/loading";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR set to false
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function EditPost() {
  const router = useRouter();
  const params = useParams(); // Use Next.js router query to get the post ID
  const { id } = params ?? {}; // Use optional chaining in case `params` is undefined
  
  const [redirect, setRedirect] = useState(false);
  const [logged, setLogged] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const { loading, setLoading, areYouLogged } = useUser();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
    "image",
  ];

  // Function to check if user is logged in
  useEffect(() => {
    const checkLogin = () => {
      setLoading(true);
      setLogged(areYouLogged());
      setLoading(false);
    };

    checkLogin();
  }, [areYouLogged, setLoading]);

  // Redirect if not logged in
  useEffect(() => {
    if (logged === false) {
      router.replace("/login");
    }
  }, [logged, router]);

  // Fetch post data when the post ID is available
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/post/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setSummary(data.summary);
          setFile(data.cover);
          setLoading(false);
        });
    }
  }, [id, setLoading]);

  // Edit post submission handler
  const editPost = useCallback(
    async (e) => {
      e.preventDefault();

      const data = new FormData();
      data.set("title", title);
      data.set("content", content);
      data.set("id", id);
      data.set("summary", summary);

      if (file) data.set("file", file[0]);

      const res = await fetch(`/api/editPost/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (res.status === 200) {
        handleQuill(content);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.message === "jwt must be provided" ? "Please enter your information" : res.message,
        });
        router.push("/");
      }
    },
    [id, title, content, summary, file, router]
  );

  // Handle content length check
  const handleQuill = useCallback((value) => {
    const textContent = value.replace(/<[^>]+>/g, "");
    if (textContent.length <= 500) {
      setRedirect(false);
      Swal.fire({
        title: "Content Error",
        text: `Content must be at least 500 characters. Current length: ${textContent.length}`,
        icon: "question",
      });
    } else {
      setContent(value);
      setRedirect(true);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Post Edited Successfully",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, []);

  // Redirect if edit was successful
  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect, router]);

  if (loading) return <Loading />;
  if (logged === false) return null;

  return (
    <form
      className="form-container m-8 bg-white p-3 overflow-hidden shadow-md rounded-lg p-6 space-y-6 min-h-min"
      onSubmit={editPost}
    >
      {/* Title Input */}
      <input
        type="text"
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Summary Input */}
      <textarea
        required
        placeholder="Enter the summary (min 150 characters)"
        minLength="150"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg overflow-hidden min-h-min focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files)}
        className="w-full px-4 py-2 text-gray-600 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500"
      />

      {/* React Quill Editor */}
      <ReactQuill
        required
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
        className="w-full h-64 mb-10 overflow-hidden"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-4/5 cursor-pointer block mx-auto bg-green-500 m-5 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
      >
        Edit Post
      </button>
    </form>
  );
}

export default EditPost;
