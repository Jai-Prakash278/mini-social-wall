import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const updatePostInState = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const deletePostFromState = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-2xl text-gray-400 mb-4">📢</p>
          <p className="text-gray-600 text-lg">No posts yet</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to share something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onUpdate={updatePostInState}
            onDelete={deletePostFromState}
          />
        ))}
      </div>
    </div>
  );
}
