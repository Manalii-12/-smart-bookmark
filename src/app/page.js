"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthButton from "@/components/AuthButton";
import BookmarkForm from "@/components/BookmarkForm";
import toast from "react-hot-toast";

export default function Home() {
  const [session, setSession] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState("");

  // ================= SESSION + REALTIME =================
  useEffect(() => {
    let realtimeChannel;

    const getSessionAndBookmarks = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      setSession(currentSession);

      if (currentSession) {
        fetchBookmarks(currentSession.user.id);

        realtimeChannel = supabase
          .channel("bookmarks-realtime")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${currentSession.user.id}`,
            },
            () => {
              fetchBookmarks(currentSession.user.id);
            }
          )
          .subscribe();
      }
    };

    getSessionAndBookmarks();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) fetchBookmarks(session.user.id);
      }
    );

    return () => {
      subscription.unsubscribe();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  // ================= FETCH =================
  const fetchBookmarks = async (userId) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data);
  };

  // ================= DELETE =================
  const deleteBookmark = async (id) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Bookmark deleted 🗑️");
      fetchBookmarks(session.user.id);
    }
  };

  // ================= UI =================
  return (
    <main className="min-h-screen p-8 bg-[#F2DCB1] text-[#3E2F1C]">

      {/* CONTAINER */}
      <div
        className="
          max-w-3xl mx-auto
          bg-white shadow-xl
          rounded-2xl p-6
          border border-[#BE8F3C]
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-[#BE8F3C]">
            🔖 Smart Bookmark
          </h1>

          <AuthButton session={session} />
        </div>

        {/* USER INFO */}
        {session && (
          <p className="text-[#BE8F3C] mb-4 font-medium">
            Logged in as {session.user.email}
          </p>
        )}

        {/* FORM */}
        {session && (
          <BookmarkForm
            user={session.user}
            fetchBookmarks={() =>
              fetchBookmarks(session.user.id)
            }
          />
        )}

        {/* SEARCH */}
        {session && (
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full p-3 mt-6 rounded-lg
              bg-[#FFF7E6]
              border border-[#BE8F3C]
              focus:ring-2 focus:ring-[#D99D29]
              outline-none
            "
          />
        )}

        {/* LIST */}
        <div className="mt-8 grid gap-4">

          {bookmarks
            .filter((bm) =>
              bm.title
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((bm) => {
              const domain = new URL(bm.url).hostname;
              const favicon = `https://www.google.com/s2/favicons?domain=${domain}`;

              return (
                <div
                  key={bm.id}
                  className="
                    flex justify-between items-center
                    p-4 rounded-xl
                    bg-[#FFF7E6]
                    border border-[#F2D29F]
                    hover:bg-[#F2DCB1]
                    transition shadow-sm
                  "
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <img
                      src={favicon}
                      alt="icon"
                      className="w-6 h-6"
                    />

                    <div>
                      <p className="font-semibold text-[#3E2F1C]">
                        {bm.title}
                      </p>
                      <p className="text-sm text-[#8DA683]">
                        {domain}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">

                    <a
                      href={bm.url}
                      target="_blank"
                      className="
                        bg-[#8DA683]
                        text-white px-3 py-1
                        rounded-lg text-sm
                        hover:bg-[#6F8C65]
                      "
                    >
                      Open
                    </a>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          bm.url
                        );
                        toast.success("Link copied 📋");
                      }}
                      className="
                        bg-[#D99D29]
                        text-white px-3 py-1
                        rounded-lg text-sm
                        hover:bg-[#BE8F3C]
                      "
                    >
                      Copy
                    </button>

                    <button
                      onClick={() =>
                        deleteBookmark(bm.id)
                      }
                      className="
                        bg-[#DC8920]
                        text-white px-3 py-1
                        rounded-lg text-sm
                        hover:bg-[#B96E18]
                      "
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })}

          {bookmarks.length === 0 && (
            <p className="text-center text-[#8DA683]">
              No bookmarks yet 🌿
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
