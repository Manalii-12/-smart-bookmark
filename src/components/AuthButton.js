"use client";

import { supabase } from "@/lib/supabaseClient";

export default function AuthButton({ session }) {

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div>
      {session ? (

        // LOGOUT
        <button
          onClick={handleLogout}
          className="
            bg-gradient-to-r
            from-[#BE8F3C]
            via-[#D99D29]
            to-[#DC8920]
            hover:opacity-90
            hover:shadow-[0_0_15px_#DC8920]
            text-white px-4 py-2
            rounded-lg shadow-md
            transition
          "
        >
          Logout
        </button>

      ) : (

        // LOGIN
        <button
          onClick={handleLogin}
          className="
            bg-gradient-to-r
            from-[#8DA683]
            via-[#D99D29]
            to-[#DC8920]
            hover:opacity-90
            hover:shadow-[0_0_20px_#D99D29]
            text-white px-4 py-2
            rounded-lg shadow-md
            transition
          "
        >
          Login with Google
        </button>

      )}
    </div>
  );
}
