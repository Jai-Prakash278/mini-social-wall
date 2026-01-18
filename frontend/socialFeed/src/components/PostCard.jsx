import { useState } from "react";
import api from "../services/api";
import CommentModal from "./CommentModal";
import { useAuth } from "../context/AuthContext";

export default function PostCard({ post, onUpdate }) {
  if (!post) return null;

  const [open, setOpen] = useState(false);
  const [liking, setLiking] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleLike = async () => {
    if (!isAuthenticated || liking) return;

    setLiking(true);
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Like failed:", err);
    } finally {
      setLiking(false);
    }
  };

  const isLiked = user && post.likes?.includes(user.id);
  const likeCount = post.likes?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-bold text-lg text-blue-600">@{post.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-3 text-base leading-relaxed">{post.text}</p>

      {post.image_url && (
        <img
          src={`http://localhost:5000${post.image_url}`}
          className="mt-3 rounded-lg w-full max-h-96 object-cover"
          alt="post"
        />
      )}

      <div className="flex gap-6 mt-4 pt-3 border-t">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || liking}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${
            isLiked 
              ? "bg-red-100 text-red-600" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLiked ? "❤️" : "🤍"} {likeCount}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          💬 Comments
        </button>
      </div>

      {open && <CommentModal postId={post._id} close={() => setOpen(false)} />}
    </div>
  );
}
