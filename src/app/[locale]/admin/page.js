"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/isAdmin";
import { CldImage } from "next-cloudinary";
import { formatTimeAgo } from "@/utils/formatTime";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !isAdmin(session.user)) {
      router.push("/");
    } else {
      fetchPosts();
    }
  }, [status, session]);

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      fetchPosts();
    }
  };

  const handleHide = async (id) => {
    await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hidden: true }),
    });
    fetchPosts();
  };

  const handlePostAnnouncement = async () => {
    if (!announcement.trim()) return;
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: announcement }),
    });
    setAnnouncement("");
    alert("Announcement posted!");
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Admin Dashboard</h1>

      {/* Announcement Section */}
      <div className="bg-white mb-4 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Post Announcement</h2>
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your announcement here..."
          rows={3}
        />
        <button
          onClick={handlePostAnnouncement}
          disabled={!announcement.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Post Announcement
        </button>
      </div>

      {/* Posts Management Section */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Manage Posts</h2>
            <button
              onClick={fetchPosts}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Refresh Posts
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No posts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      User: {post.userId || "Unknown user"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Posted: {formatTimeAgo(post.createdAt)}
                      {post.hidden && (
                        <span className="ml-2 text-red-500">(Hidden)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      Delete
                    </button>
                    {!post.hidden && (
                      <button
                        onClick={() => handleHide(post._id)}
                        className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>

                <p className="mb-3 text-gray-700">{post.caption}</p>

                {post.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <CldImage
                      width={600}
                      height={400}
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">
                    ❤️ {post.likes?.length || 0} Likes
                  </span>
                  <span>💬 {post.comments?.length || 0} Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
