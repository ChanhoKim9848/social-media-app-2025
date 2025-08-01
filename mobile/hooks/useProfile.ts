// React state hook
import { useState } from "react";

// React Native alert for feedback messages
import { Alert } from "react-native";

// React Query hooks for mutation and cache management
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Custom API utilities (used to call the backend)
import { useApiClient, userApi } from "../utils/api";

// Hook to get the currently logged-in user
import { useCurrentUser } from "./useCurrentUser";

export const useProfile = () => {
  const api = useApiClient(); // Your custom API client instance

  const queryClient = useQueryClient(); // React Query client to manage cache

  // State to control profile edit modal visibility
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // State to store editable form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const { currentUser } = useCurrentUser(); // Get current user data

  // Define mutation for updating the user profile
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => userApi.updateProfile(api, profileData), // API call to update profile
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Refresh user data cache
      setIsEditModalVisible(false); // Close the modal
      Alert.alert("Success", "Profile updated successfully!"); // Show success message
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile" // Fallback error message
      );
    },
  });

  // Open the edit modal and preload current user info into the form
  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
    setIsEditModalVisible(true); // Show the modal
  };

  // Update a single field in the form
  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Return everything the component will need from this hook
  return {
    isEditModalVisible,                       // For controlling modal visibility
    formData,                                 // Current editable profile data
    openEditModal,                            // Function to open modal and load form
    closeEditModal: () => setIsEditModalVisible(false), // Function to close modal
    saveProfile: () => updateProfileMutation.mutate(formData), // Save form data to API
    updateFormField,                          // Function to update form fields
    isUpdating: updateProfileMutation.isPending, // Show spinner during save
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), // Force re-fetch of user
  };
};
