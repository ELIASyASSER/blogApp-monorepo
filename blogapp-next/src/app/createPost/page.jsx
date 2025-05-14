"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import 'react-quill-new/dist/quill.snow.css';
import { useUser } from "@/context/context";
import Loading from "../loading";

// Load ReactQuill dynamically (for client-side only)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function CreatePost() {
  const router = useRouter();
  const { loading, setLoading, areYouLogged } = useUser();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [logged, setLogged] = useState(null);
  const [creating, setCreating] = useState(false);

  const [redirect, setRedirect] = useState(false);

  // ✅ Memoize toolbar config to prevent unnecessary re-creation
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'link', 'image'
  ], []);

  // ✅ Submit handler
  const newPost = useCallback(async (e) => {
    e.preventDefault();

    const plainText = content.replace(/<[^>]+>/g, '');
    if (plainText.length < 500) {
      await Swal.fire({
        title: "Content Too Short",
        text: `Content must be at least 500 characters. Current: ${plainText.length}`,
        icon: "warning"
      });
      return;
    }

    if (!file) {
      await Swal.fire({
        title: "File Missing",
        text: "Please select an image file.",
        icon: "warning"
      });
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("content", content);
    formData.set("file", file);

    try {
      setCreating(true);

      const res = await fetch("/api/createPost", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 201) {
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Post Created Successfully",
          showConfirmButton: false,
          timer: 2000
        });
        setRedirect(true);
      } else {
        await Swal.fire({
          title: "Error",
          text: data.message || "Something went wrong",
          icon: "error"
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Network Error",
        text: "Failed to connect to server.",
        icon: "error"
      });
    } finally {
      setCreating(false);
    }
  }, [title, summary, content, file, setCreating]);

  // ✅ Check auth on mount
  useEffect(() => {
    const check = () => {
      setLoading(true);
      const isLogged = areYouLogged();
      setLogged(isLogged);
      setLoading(false);
    };
    check();
  }, [areYouLogged, setLoading]);

  // ✅ Redirect after post creation
  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect, router]);

  // ✅ Redirect to login if not logged in
  useEffect(() => {
    if (logged === false) {
      router.replace("/login");
    }
  }, [logged, router]);

  if (loading) return <Loading />;
  if (logged === false) return null;

  return (
    <form
      onSubmit={newPost}
      className="form-container m-8 bg-white shadow-md rounded-lg p-6 space-y-6"
    >
      <input
        type="text"
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-4/5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        required
        minLength={150}
        maxLength={500}
        placeholder="Enter the summary (150–500 characters)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-4 py-2 text-gray-600 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500"
      />

      <ReactQuill
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
        className="w-full h-64 mb-10 overflow-auto"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white cursor-pointer py-3 rounded-lg font-semibold transition duration-300 ${
          creating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {creating ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}

export default CreatePost;
