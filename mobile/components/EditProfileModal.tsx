// Import React Native UI components
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios"; // For API calls

// Define the props the modal accepts, with types for TypeScript
interface EditProfileModalProps {
  isVisible: boolean; // Controls modal visibility
  onClose: () => void; // Function to close the modal
  formData: {
    // Form values for editing
    firstName: string;
    lastName: string;
    bio: string;
    location: string;

    // banner image and profile picture form data
    bannerImage: string;
    profilePicture: string;
  };
  saveProfile: () => void; // Function to save profile data
  updateFormField: (field: string, value: string) => void; // Updates form fields
  isUpdating: boolean; // Loading state during saving
}

const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// Helper to upload to Cloudinary
const uploadToCloudinary = async (uri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

// Functional component definition with props destructuring.
const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
}: EditProfileModalProps) => {
  // Helper function to ask user if they want to edit profile or banner image
  const promptImageEdit = (type: "profilePicture" | "bannerImage") => {
    Alert.alert(
      `Edit ${type === "profilePicture" ? "Profile Picture" : "Banner Image"}`,
      `Do you want to update your ${
        type === "profilePicture" ? "profile picture" : "banner image"
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => openImagePicker(type),
        },
      ]
    );
  };

  // Ask for permissions and open image picker or camera
  const openImagePicker = async (type: "profilePicture" | "bannerImage") => {
    // Ask user if they want to take photo or pick from gallery
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        {
          text: "Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permission denied", "Camera access is required.");
              return;
            }
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: type === "bannerImage" ? [4, 2] : [1, 1],
              quality: 0.7,
            });

            if (!result.canceled && result.assets?.length) {
              updateFormField(type, result.assets[0].uri);
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permission denied", "Gallery access is required.");
              return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: type === "bannerImage" ? [4, 2] : [1, 1],
              quality: 0.7,
            });

            if (!result.canceled && result.assets?.length) {
              updateFormField(type, result.assets[0].uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // When save button is pressed, call save and then close the modal.
  const handleSave = async () => {
  try {
    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("bio", formData.bio);
    form.append("location", formData.location);

    // Upload profile picture to Cloudinary if it's local
    let profileUrl = formData.profilePicture;
    if (profileUrl && profileUrl.startsWith("file")) {
      profileUrl = await uploadToCloudinary(profileUrl);
    }

    // Upload banner image to Cloudinary if it's local
    let bannerUrl = formData.bannerImage;
    if (bannerUrl && bannerUrl.startsWith("file")) {
      bannerUrl = await uploadToCloudinary(bannerUrl);
    }

    // Send final Cloudinary URLs to your backend
    await axios.put(
      `${process.env.EXPO_PUBLIC_API_URL}/users/update`,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        location: formData.location,
        profilePicture: profileUrl,
        bannerImage: bannerUrl,
      },
      { withCredentials: true }
    );

    saveProfile();
    onClose();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to update profile.");
  }
};


  return (
    // Native modal with slide animation and pageSheet style (bottom sheet look)
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/* Header with Cancel, Title, and Save */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-green-500 text-lg">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""}`} // Make button semi-transparent if loading
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#73C883" /> // Spinner while saving
          ) : (
            <Text className="text-green-500 text-lg font-semibold">Save</Text> // Normal save button
          )}
        </TouchableOpacity>
      </View>

      {/* Scrollable content so the form works on small screens */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Banner Preview */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => promptImageEdit("bannerImage")}
          className="w-full h-40 mb-6"
        >
          <Image
            source={{
              uri:
                formData.bannerImage ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
            }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Profile Picture Preview */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => promptImageEdit("profilePicture")}
          className="items-center mb-6 -mt-20 z-10"
        >
          <Image
            source={{ uri: formData.profilePicture }}
            className="w-32 h-32 rounded-full border-4 border-white bg-white"
          />
        </TouchableOpacity>
        <View className="space-y-4">
          {/* First Name input */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>

          {/* Last Name input */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>

          {/* Bio input - multiline text area */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top" // Makes the text align to top in Android
            />
          </View>

          {/* Location input */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
