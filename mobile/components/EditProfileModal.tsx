// Import React Native UI components
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";

// Define the props the modal accepts, with types for TypeScript
interface EditProfileModalProps {
  isVisible: boolean;                                 // Controls modal visibility
  onClose: () => void;                                // Function to close the modal
  formData: {                                          // Form values for editing
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  saveProfile: () => void;                            // Function to save profile data
  updateFormField: (field: string, value: string) => void; // Updates form fields
  isUpdating: boolean;                                // Loading state during saving
}

// Functional component definition with props destructuring
const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
}: EditProfileModalProps) => {

  // When save button is pressed, call save and then close the modal
  const handleSave = () => {
    saveProfile();
    onClose();
  };

  return (
    // Native modal with slide animation and pageSheet style (bottom sheet look)
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
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
