import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/fomatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";

// Define the expected props for the PostCard component
interface PostCardProps {
  post: Post; // The post to display
  onLike: (postId: string) => void; // Function to call when the post is liked
  onDelete: (postId: string) => void; // Function to call when the post is deleted
  onComment: (post: Post) => void; // Function to open comments modal
  isLiked?: boolean; // Whether the current user liked the post
  currentUser: User; // The currently logged-in user
}

// Define the functional component
const PostCard = ({
  currentUser, // Destructure currentUser from props
  onDelete, // Destructure onDelete function
  onLike, // Destructure onLike function
  post, // Destructure post object
  isLiked, // Destructure isLiked flag
  onComment, // Destructure onComment function
}: PostCardProps) => {
  // Determine if the post was made by the current user
  const isOwnPost = post.user._id === currentUser._id;

  // Function to show delete confirmation dialog
  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" }, // Cancel button
      {
        text: "Delete", // Confirm delete button
        style: "destructive", // Destructive (red) button style
        onPress: () => onDelete(post._id), // Call onDelete function with post ID
      },
    ]);
  };

  // Return the rendered post card
  return (
    // Card container with border
    <View className="border-b border-gray-100 bg-white">
      {/* Row container for profile image and content */}
      <View className="flex-row p-4">
        {/* User profile image */}
        <Image
          source={{ uri: post.user.profilePicture || "" }} // Fallback to empty string if no image
          className="w-12 h-12 rounded-full mr-3" // Size and styling
        />

        {/* Right side: post content and actions */}
        <View className="flex-1">
          {/* Row for name, username, date, and delete icon */}
          <View className="flex-row items-center justify-between mb-1">
            {/* Name and username */}
            <View className="flex-row items-center flex-wrap">
              <Text className="font-bold text-gray-900 mr-1">
                {post.user.firstName} {post.user.lastName} {/* Full name */}
              </Text>
              <Text className="text-gray-500 ml-1">
                @{post.user.username} · {formatDate(post.createdAt)}
                {/* Username and date */}
              </Text>
            </View>

            {/* Show delete icon if it's the user's own post */}
            {isOwnPost && (
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash" size={20} color="#657786" />
                {/* Trash icon */}
              </TouchableOpacity>
            )}
          </View>

          {/* Post text content */}
          {post.content && (
            <Text className="text-gray-900 text-base leading-5 mb-3">
              {post.content} {/* Show post content if available */}
            </Text>
          )}

          {/* Post image (if exists) */}
          {post.image && (
            <Image
              source={{ uri: post.image }} // Post image URL
              className="w-full h-48 rounded-2xl mb-3" // Style and size
              resizeMode="cover" // Cover the image area
            />
          )}

          {/* Post action buttons */}
          <View className="flex-row justify-between max-w-xs">
            {/* Comment button */}
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onComment(post)}
            >
              <Feather name="message-circle" size={18} color="#657786" />
              {/* Comment icon */}
              <Text className="text-gray-500 text-sm ml-2">
                {formatNumber(post.comments?.length || 0)}
                {/* Show number of comments */}
              </Text>
            </TouchableOpacity>

            {/* Retweet/share placeholder */}
            <TouchableOpacity className="flex-row items-center">
              <Feather name="repeat" size={18} color="#657786" />
              {/* Retweet icon */}
              <Text className="text-gray-500 text-sm ml-2">0</Text>
              {/* Hardcoded 0 */}
            </TouchableOpacity>

            {/* Like button */}
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onLike(post._id)}
            >
              {/* Show filled heart if liked, otherwise outline */}
              {isLiked ? (
                <AntDesign name="heart" size={18} color="#E0245E" /> // Liked heart
              ) : (
                <Feather name="heart" size={18} color="#657786" /> // Unliked heart
              )}

              {/* Show number of likes, colored if liked */}
              <Text
                className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
              >
                {formatNumber(post.likes?.length || 0)}
              </Text>
            </TouchableOpacity>

            {/* Share button (not implemented yet) */}
            <TouchableOpacity>
              <Feather name="share" size={18} color="#657786" />
              {/* Share icon */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
