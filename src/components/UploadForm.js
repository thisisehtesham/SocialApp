"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UploadForm({ dict }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpload = async () => {
    if (!session) {
      alert("Please sign in to upload posts");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    const base64 = await toBase64(image);
    const res = await fetch("/api/posts/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption,
        image: base64,
        userId: session.user.name,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.message || "Upload failed");
      return;
    }

    const data = await res.json();
    
    router.refresh();

    setCaption("");
    setImage(null);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <textarea
            placeholder={dict.post_placeholder || "What's on your mind?"}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-2 text-blue-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!session}
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
              {session ? dict.post : "Please Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
