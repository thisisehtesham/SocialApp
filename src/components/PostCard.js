"use client";
import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { formatTimeAgo } from "@/utils/formatTime";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  const handleLike = async () => {
    const res = await fetch(`/api/posts/like`, {
      method: "POST",
      body: JSON.stringify({ postId: post._id }),
    });
    if (res.ok) setLikes((prev) => prev + 1);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch(`/api/posts/comment`, {
      method: "POST",
      body: JSON.stringify({ postId: post._id, text: newComment }),
    });
    if (res.ok) {
      const { comment } = await res.json();
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 max-w-2xl mx-auto mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {post.userId?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{post.userId}</p>
            <p className="text-sm text-gray-500 mb-2">
              Posted: {formatTimeAgo(post.createdAt)}
              {post.hidden && (
                <span className="ml-2 text-red-500">(Hidden)</span>
              )}
            </p>
          </div>
        </div>

        <p className="text-gray-800 mb-4">{post.caption}</p>
      </div>

      {/* Post Image */}
      <div className="w-full flex justify-center bg-gray-100">
        <CldImage
          width="800"
          height="600"
          src={post.imageUrl}
          alt="User post"
          className="max-h-[600px] object-contain"
        />
      </div>

      {/* Post Actions */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{comments.length}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-4">
        {comments.length > 0 && (
          <div className="space-y-3 mb-4">
            <h3 className="font-semibold text-sm">Comments</h3>
            {comments.map((c, i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 mt-1 flex-shrink-0"></div>
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <p className="font-semibold text-sm">{session?.user?.name}</p>
                  <p className="text-sm text-gray-800">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="flex-1 flex bg-gray-100 rounded-full px-3 py-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="bg-transparent w-full focus:outline-none text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              onClick={handleComment}
              className="text-blue-500 font-medium text-sm px-2 hover:text-blue-700"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
