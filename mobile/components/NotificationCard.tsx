// Import necessary components and functions from external libraries
import { Notification } from "@/types"; // Type for Notification object
import { formatDate } from "@/utils/fomatters"; // Function to format date
import { Feather } from "@expo/vector-icons"; // Feather icon library for icons
import { View, Text, Alert, Image, TouchableOpacity } from "react-native"; // React Native components

// Define the types for props that this component will receive
interface NotificationCardProps {
  notification: Notification; // The notification object
  onDelete: (notificationId: string) => void; // Function to delete a notification by ID
}

// NotificationCard component to display an individual notification
const NotificationCard = ({ notification, onDelete }: NotificationCardProps) => {
  
  // Function to determine the text description of the notification
  const getNotificationText = () => {
    // Combine first and last name of the user sending the notification
    const name = `${notification.from.firstName} ${notification.from.lastName}`;

    // Return different messages depending on the notification type
    switch (notification.type) {
      case "like":
        return `${name} liked your post`; // "like" type notification
      case "comment":
        return `${name} commented on your post`; // "comment" type notification
      case "follow":
        return `${name} started following you`; // "follow" type notification
      default:
        return ""; // Return empty string if type is unknown
    }
  };

  // Function to get the correct icon for each notification type
  const getNotificationIcon = () => {
    // Choose the icon based on the notification type
    switch (notification.type) {
      case "like":
        return <Feather name="heart" size={20} color="#E0245E" />; // Red heart for "like"
      case "comment":
        return <Feather name="message-circle" size={20} color="#1DA1F2" />; // Blue message-circle for "comment"
      case "follow":
        return <Feather name="user-plus" size={20} color="#17BF63" />; // Green user-plus for "follow"
      default:
        return <Feather name="bell" size={20} color="#657786" />; // Default bell icon
    }
  };

  // Function to handle the deletion of a notification with a confirmation prompt
  const handleDelete = () => {
    // Show an alert to confirm the deletion
    Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
      { text: "Cancel", style: "cancel" }, // Cancel option
      {
        text: "Delete", // Delete option
        style: "destructive", // Style for destructive action (deletes notification)
        onPress: () => onDelete(notification._id), // Call the onDelete function passed as prop with notification ID
      },
    ]);
  };

  return (
    <View className="border-b border-gray-100 bg-white"> {/* Container for the notification card */}
      <View className="flex-row p-4"> {/* Row for notification details */}
        <View className="relative mr-3"> {/* Profile picture and notification icon */}
          <Image
            source={{ uri: notification.from.profilePicture }} // Display the sender's profile picture
            className="size-12 rounded-full" // Style for the profile picture (round and small)
          />
          
          <View className="absolute -bottom-1 -right-1 size-6 bg-white items-center justify-center"> {/* Positioning the notification icon over the profile picture */}
            {getNotificationIcon()} {/* Call to get the notification icon */}
          </View>
        </View>

        <View className="flex-1"> {/* Container for the text and action buttons */}
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1"> {/* Left side for text content */}
              <Text className="text-gray-900 text-base leading-5 mb-1"> {/* Main notification message */}
                <Text className="font-semibold"> {/* Display sender's name in bold */}
                  {notification.from.firstName} {notification.from.lastName}
                </Text>
                <Text className="text-gray-500"> @{notification.from.username}</Text> {/* Display username */}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">{getNotificationText()}</Text> {/* Display notification-specific text */}
            </View>

            <TouchableOpacity className="ml-2 p-1" onPress={handleDelete}> {/* Button to delete the notification */}
              <Feather name="trash" size={16} color="#E0245E" /> {/* Trash icon for delete */}
            </TouchableOpacity>
          </View>

          {/* Conditionally render the post content if it exists */}
          {notification.post && (
            <View className="bg-gray-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-700 text-sm mb-1" numberOfLines={3}>
                {notification.post.content} {/* Post content text */}
              </Text>
              {notification.post.image && (
                <Image
                  source={{ uri: notification.post.image }} // Post image if available
                  className="w-full h-32 rounded-lg mt-2"
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {/* Conditionally render the comment content if it exists */}
          {notification.comment && (
            <View className="bg-blue-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-600 text-xs mb-1">Comment:</Text> {/* Comment label */}
              <Text className="text-gray-700 text-sm" numberOfLines={2}>
                &ldquo;{notification.comment.content}&rdquo; {/* Display the comment text */}
              </Text>
            </View>
          )}

          <Text className="text-gray-400 text-xs">{formatDate(notification.createdAt)}</Text> {/* Display the formatted notification creation date */}
        </View>
      </View>
    </View>
  );
};

export default NotificationCard; // Export the component for use in other parts of the app
