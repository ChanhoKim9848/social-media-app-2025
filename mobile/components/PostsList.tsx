import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import PostCard from "./PostCard";
import { useState } from "react";
import CommentsModal from "./CommentsModal";

// Component to display a list of posts, optionally filtered by a username
const PostsList = ({ username }: { username?: string }) => {
  const { currentUser } = useCurrentUser();

  // Custom hook for fetching and managing posts
  const {
    posts,
    isLoading,
    error,
    refetch,
    toggleLike,
    deletePost,
    checkIsLiked,
  } = usePosts(username);

  // Tracks which post is currently selected to view comments
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Get the full post object based on selectedPostId
  const selectedPost = selectedPostId
    ? posts.find((p: Post) => p._id === selectedPostId)
    : null;

  // Show loading indicator while posts are being fetched
  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#73C883" />
        <Text className="text-gray-500 mt-2">Loading posts...</Text>
      </View>
    );
  }

  // Show error UI with retry option
  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 mb-4">Failed to load posts</Text>
        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If no posts are available
  if (posts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  return (
    <>
      {/* Render all posts using the PostCard component */}
      {posts.map((post: Post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={toggleLike}
          onDelete={deletePost}
          onComment={() => setSelectedPostId(post._id)}
          currentUser={currentUser}
          isLiked={checkIsLiked(post.likes, currentUser)}
        />
      ))}

      {/* Modal for viewing and interacting with post comments */}
      <CommentsModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPostId(null)}
      />
    </>
  );
};

export default PostsList;
