import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CommentModal({ postId, close }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!text.trim() || !isAuthenticated || submitting) return;

    setSubmitting(true);
    try {
      await api.post(`/posts/${postId}/comment`, {
        comment: text,
      });
      setText("");
      await fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={close}
    >
      <div 
        className="bg-white p-6 w-full max-w-lg rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">💬 Comments</h3>
          <button 
            onClick={close}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="bg-gray-50 p-3 rounded">
                <p className="font-semibold text-blue-600 text-sm">@{c.username}</p>
                <p className="text-gray-800 mt-1">{c.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {isAuthenticated ? (
          <div>
            <textarea
              className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button 
                onClick={submit} 
                disabled={!text.trim() || submitting}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
              <button
                onClick={close}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">
            Please login to comment
          </p>
        )}
      </div>
    </div>
  );
}
