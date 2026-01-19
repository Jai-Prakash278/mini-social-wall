import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CommentModal from "./CommentModal";
import { useAuth } from "../context/AuthContext";

export default function PostCard({ post, onUpdate, onDelete }) {
  if (!post) return null;

  const [open, setOpen] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const isLiked = user && post.likes?.includes(user.id || user._id);
  const likeCount = post.likes?.length || 0;
  const isOwner = user && post.user === (user.id || user._id);

  const handleEdit = () => {
    navigate("/create", { state: { post } });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Image at the top if exists */}
      {post.image_url && (
        <div className="w-full h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <img
            src={`http://localhost:5000${post.image_url}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            alt="post"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        {/* Header with user info and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow">
            <p className="font-bold text-base text-blue-600 hover:text-blue-700 transition">@{post.username}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Post text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow line-clamp-4">{post.text}</p>

        {/* Actions bar */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated || liking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isLiked 
                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </button>
        </div>
      </div>

      {open && <CommentModal postId={post._id} close={() => setOpen(false)} />}
    </div>
  );
}
