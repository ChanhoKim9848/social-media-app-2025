// Import necessary hooks and components
import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";

// Define the expected props for the CommentsModal component
interface CommentsModalProps {
  selectedPost: Post;  // The post whose comments we are viewing
  onClose: () => void; // Function to call when closing the modal
}

// Define the functional CommentsModal component
const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps) => {
  // Use custom hook to handle comment text and posting
  const { commentText, setCommentText, createComment, isCreatingComment } = useComments();

  // Get current logged-in user info
  const { currentUser } = useCurrentUser();

  // Clear comment text and close modal when close button pressed
  const handleClose = () => {
    onClose();          // Call parent close handler
    setCommentText(""); // Reset comment input field
  };

  return (
    // Show modal only if selectedPost is truthy; slide animation and page sheet style
    <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet">
      
      {/* MODAL HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* Close button */}
        <TouchableOpacity onPress={handleClose}>
          <Text className="text-green-500 text-lg">Close</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-semibold">Comments</Text>

        {/* Empty view to balance flex layout */}
        <View className="w-12" />
      </View>

      {/* Only render if selectedPost exists */}
      {selectedPost && (
        <ScrollView className="flex-1">

          {/* ORIGINAL POST DISPLAY */}
          <View className="border-b border-gray-100 bg-white p-4">
            <View className="flex-row">
              {/* User profile picture */}
              <Image
                source={{ uri: selectedPost.user.profilePicture }}
                className="size-12 rounded-full mr-3"
              />

              {/* Post content */}
              <View className="flex-1">
                {/* User name and username */}
                <View className="flex-row items-center mb-1">
                  <Text className="font-bold text-gray-900 mr-1">
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text className="text-gray-500 ml-1">@{selectedPost.user.username}</Text>
                </View>

                {/* Post text content */}
                {selectedPost.content && (
                  <Text className="text-gray-900 text-base leading-5 mb-3">
                    {selectedPost.content}
                  </Text>
                )}

                {/* Post image if exists */}
                {selectedPost.image && (
                  <Image
                    source={{ uri: selectedPost.image }}
                    className="w-full h-48 rounded-2xl mb-3"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
          </View>

          {/* COMMENTS LIST */}
          {selectedPost.comments.map((comment) => (
            <View key={comment._id} className="border-b border-gray-100 bg-white p-4">
              <View className="flex-row">
                {/* Commenter's profile picture */}
                <Image
                  source={{ uri: comment.user.profilePicture }}
                  className="w-10 h-10 rounded-full mr-3"
                />

                {/* Comment content */}
                <View className="flex-1">
                  {/* Commenter's name and username */}
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-gray-900 mr-1">
                      {comment.user.firstName} {comment.user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">@{comment.user.username}</Text>
                  </View>

                  {/* The comment text */}
                  <Text className="text-gray-900 text-base leading-5 mb-2">{comment.content}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* ADD COMMENT INPUT SECTION */}
          <View className="p-4 border-t border-gray-100">
            <View className="flex-row">
              {/* Current user's profile picture */}
              <Image
                source={{ uri: currentUser?.profilePicture }}
                className="size-10 rounded-full mr-3"
              />

              {/* Text input and send button container */}
              <View className="flex-1">
                {/* Multi-line text input for comment */}
                <TextInput
                  className="border border-gray-200 rounded-lg p-3 text-base mb-3"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}  // Update comment text as user types
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"       // Align text to the top when multiline
                />

                {/* Submit comment button */}
                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg self-start ${
                    commentText.trim() ? "text-green-500" : "bg-gray-300"
                  }`}                           // Blue button active only if there is text
                  onPress={() => createComment(selectedPost._id)}  // Call createComment with post id
                  disabled={isCreatingComment || !commentText.trim()} // Disable button if loading or empty input
                >
                  {isCreatingComment ? (
                    // Show spinner while posting comment
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    // Show button text 'Reply'
                    <Text
                      className={`font-semibold ${
                        commentText.trim() ? "text-white" : "text-gray-500"
                      }`}
                    >
                      Reply
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

// Export the CommentsModal component for use in other parts of the app
export default CommentsModal;
