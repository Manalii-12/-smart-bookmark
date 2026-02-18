# 🔖 Smart Bookmark App

A full-stack bookmark manager built as part of a technical selection process.
Users can securely save, manage, and access bookmarks with real-time updates.

---

## 🚀 Live Demo

👉https://smart-bookmark-red.vercel.app/

---

## 💻 GitHub Repository

👉 https://github.com/Manalii-12/-smart-bookmark

---

# ✨ Features

* 🔐 Google OAuth Authentication
* ➕ Add Bookmarks (Title + URL)
* 🗑️ Delete Bookmarks
* 👤 User-specific private data
* ⚡ Realtime sync across tabs
* 📋 Copy bookmark link
* 🔍 Search bookmarks
* 🎨 Custom themed UI (Earthy palette)
* ☁️ Deployed on Vercel

---

# 🧰 Tech Stack

| Layer      | Tech                  |
| ---------- | --------------------- |
| Frontend   | Next.js (App Router)  |
| Styling    | Tailwind CSS          |
| Backend    | Supabase              |
| Database   | PostgreSQL (Supabase) |
| Auth       | Google OAuth          |
| Realtime   | Supabase Realtime     |
| Deployment | Vercel                |

---

# 🗄️ Database Schema

**Table:** `bookmarks`

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| title      | text      |
| url        | text      |
| created_at | timestamp |

Row Level Security (RLS) ensures users access only their own bookmarks.

---

# ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

# 🧩 Challenges Faced & Solutions

## 1️⃣ Google OAuth Redirect Error

**Problem:**
Encountered `redirect_uri_mismatch` while logging in.

**Cause:**
Supabase callback URL was not added in Google Cloud OAuth settings.

**Solution:**
Added redirect URI:

```
https://PROJECT_ID.supabase.co/auth/v1/callback
```

Login worked successfully afterward.

---

## 2️⃣ Row Level Security Blocking Inserts

**Problem:**
Bookmarks were not inserting into the database.

**Cause:**
RLS was enabled but policies were missing.

**Solution:**
Created policies allowing users to access only their data:

```sql
auth.uid() = user_id
```

Applied to SELECT, INSERT, DELETE.

---

## 3️⃣ Realtime Updates Not Working

**Problem:**
Bookmarks added in one tab didn’t reflect in another.

**Solution:**

* Enabled Realtime replication in Supabase.
* Subscribed using `postgres_changes`.
* Filtered by logged-in `user_id`.

Now bookmarks sync instantly.

---

## 4️⃣ GitHub Push Errors

**Problem:**
Faced:

```
src refspec main does not match any
```

**Cause:**

* Local branch wasn’t `main`.
* Wrong GitHub account credentials.

**Solution:**

* Renamed branch to `main`.
* Cleared Credential Manager.
* Re-authenticated with correct GitHub account.

---

## 5️⃣ UI Theme Consistency

**Problem:**
Initial UI had inconsistent colors.

**Solution:**
Applied a cohesive earthy palette:

```
#8DA683
#BE8F3C
#D99D29
#F2DCB1
#DC8920
```

Styled buttons, cards, and layout accordingly.

---

# 📈 Future Improvements

* Bookmark categories / tags
* Drag-and-drop sorting
* Dark mode toggle
* Bookmark preview thumbnails
* Shareable bookmark collections

---

# 👩‍💻 Author

**Manali**
Built as part of a technical selection task.

---

# 🙌 Acknowledgment

Thank you for reviewing this project.
Looking forward to your feedback 🚀
