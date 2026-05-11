import { useState } from "react";
import { MessageSquare, Plus, Calendar, Users, Package, Droplets } from "lucide-react";

const OperationsFeed = ({ groupId }) => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "announcement",
      content: "Crop planning updated for Rabi 2026 season",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: "Leader",
    },
    {
      id: 2,
      type: "update",
      content: "New batch AGS-WHEAT-2026-001 created",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      author: "System",
    },
    {
      id: 3,
      type: "reminder",
      content: "Irrigation scheduled for tomorrow at 6 AM",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      author: "Leader",
    },
  ]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const newPostObj = {
      id: posts.length + 1,
      type: "announcement",
      content: newPost,
      timestamp: new Date(),
      author: "Leader",
    };
    setPosts([newPostObj, ...posts]);
    setNewPost("");
  };

  const getPostIcon = (type) => {
    switch (type) {
      case "announcement": return <MessageSquare className="text-blue-600" size={16} />;
      case "update": return <Package className="text-green-600" size={16} />;
      case "reminder": return <Droplets className="text-orange-600" size={16} />;
      default: return <MessageSquare className="text-gray-600" size={16} />;
    }
  };

  const getPostColor = (type) => {
    switch (type) {
      case "announcement": return "border-l-blue-500";
      case "update": return "border-l-green-500";
      case "reminder": return "border-l-orange-500";
      default: return "border-l-gray-500";
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="text-pink-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Operations Feed</h3>
          <p className="text-sm text-gray-600">Group updates and announcements</p>
        </div>
      </div>

      {/* Post Input */}
      <div className="mb-6 p-4 bg-gray-50/50 rounded-xl">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Post an announcement or update..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handlePost}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Post Update
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-4 bg-gray-50/50 rounded-xl border-l-4 ${getPostColor(post.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getPostIcon(post.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{post.content}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span className="font-medium">{post.author}</span>
                  <span>•</span>
                  <span>{post.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsFeed;