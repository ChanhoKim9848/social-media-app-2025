import NoNotificationsFound from "@/components/NoNotificationsFound"; // Component for when no notifications are available
import NotificationCard from "@/components/NotificationCard"; // Component to display individual notifications
import { useNotifications } from "@/hooks/useNotifications"; // Custom hook to fetch and manage notifications
import { Notification } from "@/types"; // Notification type for TypeScript
import { Feather } from "@expo/vector-icons"; // Icon library for notifications and settings icon
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native"; // Core React Native components
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Safe area for screens

// Main Notifications screen component
const NotificationsScreen = () => {
  // Using the custom hook to get notifications and related states
  const { notifications, isLoading, error, refetch, isRefetching, deleteNotification } =
    useNotifications();

  // Get insets for safe area padding (useful for handling notch and bottom tabs)
  const insets = useSafeAreaInsets();

  // Handle error if notifications fail to load
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-gray-500 mb-4">Failed to load notifications</Text>
        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()} // Retry fetching notifications on button press
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header section with title and settings icon */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#657786" /> {/* Settings icon */}
        </TouchableOpacity>
      </View>

      {/* Main content area */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }} // Add padding for the bottom area
        showsVerticalScrollIndicator={false} // Hide scroll bar
        refreshControl={
          // Pull-to-refresh to refetch notifications
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={"#1DA1F2"} />
        }
      >
        {/* Show loading indicator while data is being fetched */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" color="#1DA1F2" /> {/* Spinning loader */}
            <Text className="text-gray-500 mt-4">Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          // If no notifications, show 'NoNotificationsFound' component
          <NoNotificationsFound />
        ) : (
          // Map over the notifications array and display each one using the NotificationCard component
          notifications.map((notification: Notification) => (
            <NotificationCard
              key={notification._id} // Unique key for each notification
              notification={notification} // Pass notification data as props
              onDelete={deleteNotification} // Pass delete function to handle delete action
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen; // Export the component to be used in other parts of the app
