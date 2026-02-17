"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";


export default function BookmarkForm({ user, fetchBookmarks }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title && !url) {
  toast.error("Please fill all fields ❌");
  return;
}

if (!title) {
  toast.error("Please fill title field ❌");
  return;
}

if (!url) {
  toast.error("Please fill URL field ❌");
  return;
}


  const { error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Bookmark added 🚀"); // ✅ TOASTER HERE
    setTitle("");
    setUrl("");
    fetchBookmarks();
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <input
        type="text"
        placeholder="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full"
      />

      <button
  className="
    bg-gradient-to-r
    from-[#81a773]
    via-[#D99D29]
    to-[#DC8920]
    hover:opacity-90
    hover:shadow-[0_0_20px_#D99D29]
    text-white px-5 py-2
    rounded-lg shadow-lg
    transition
  "
>
  Add Bookmark
</button>

    </form>
  );
}
