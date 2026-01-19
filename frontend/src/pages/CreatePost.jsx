import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.post;
  const isEditMode = !!editPost;

  useEffect(() => {
    if (editPost) {
      setText(editPost.text || "");
      setExistingImageUrl(editPost.image_url || "");
    }
  }, [editPost]);

  const submitPost = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      if (isEditMode) {
        await api.put(`/posts/${editPost._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post("/posts", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Redirect to home page after successful post
      navigate("/");
    } catch (err) {
      console.error('Error updating/creating post:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || `Failed to ${isEditMode ? "update" : "create"} post`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "✏️ Edit Post" : "✏️ Create New Post"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submitPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What's on your mind?</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">📷 Add Image (Optional)</label>
            {existingImageUrl && !image && (
              <div className="mb-2">
                <img 
                  src={`http://localhost:5000${existingImageUrl}`} 
                  alt="Current" 
                  className="max-h-32 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {image && (
              <p className="text-sm text-gray-600 mt-2">✅ {image.name}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition font-medium"
            >
              {loading ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "✏️ Update" : "🚀 Post")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
