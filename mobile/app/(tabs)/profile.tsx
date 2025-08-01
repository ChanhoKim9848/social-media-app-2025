// Import reusable UI components and custom logic hooks
import EditProfileModal from "@/components/EditProfileModal";  // Modal to edit profile info
import PostsList from "@/components/PostsList";                // List of user's posts
import SignOutButton from "@/components/SignOutButton";        // Sign out button
import { useCurrentUser } from "@/hooks/useCurrentUser";       // Hook to get current logged-in user
import { usePosts } from "@/hooks/usePosts";                   // Hook to fetch posts
import { useProfile } from "@/hooks/useProfile";               // Hook to manage profile editing

// Icons and date formatting
import { Feather } from "@expo/vector-icons";                 // Icon library
import { format } from "date-fns";                            // Utility to format date

// React Native UI components
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Handles screen padding for notches

const ProfileScreens = () => {
  // Fetch current user data (name, bio, image, etc.)
  const { currentUser, isLoading } = useCurrentUser();

  // Get padding for safe area (e.g., iPhone notch)
  const insets = useSafeAreaInsets();

  // Fetch the user's posts and provide refresh functionality
  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(currentUser?.username);

  // Manage profile editing modal and form state
  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  // Show spinner while loading user data
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        {/* color of spinner */}
        <ActivityIndicator size="large" color="#73C883" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header with name and post count */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
        </View>
        <SignOutButton /> {/* Sign-out functionality */}
      </View>

      {/* Scrollable main content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile(); // Refresh profile data
              refetchPosts();   // Refresh posts
            }}
            tintColor="#73C883"
          />
        }
      >
        {/* Profile banner image */}
        <Image
          source={{
            uri:
              currentUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop", // fallback
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Profile picture, edit button, and user info */}
        <View className="px-4 pb-4 border-b border-gray-100">
          {/* profile avatar half covers the banner image */}
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            {/* User profile image */}
            <Image
              source={{ uri: currentUser.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {/* Edit profile button */}
            <TouchableOpacity
              className="border border-gray-300 px-6 py-2 rounded-full"
              onPress={openEditModal}
            >
              <Text className="font-semibold text-gray-900">Edit profile</Text>
            </TouchableOpacity>
          </View>

          {/* User display name, username, bio, location, and join date */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#73C883" /> {/* Verified badge */}
            </View>
            <Text className="text-gray-500 mb-2">@{currentUser.username}</Text>
            <Text className="text-gray-900 mb-3">{currentUser.bio}</Text>

            {/* Location */}
            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{currentUser.location}</Text>
            </View>

            {/* Join date */}
            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(currentUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            {/* Follower and Following count */}
            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{currentUser.following?.length}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">{currentUser.followers?.length}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Display user's posts */}
        <PostsList username={currentUser?.username} />
      </ScrollView>

      {/* Edit Profile Modal, appears when editing */}
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  );
};

export default ProfileScreens;
