// This custom React hook useComments helps manage the logic and state around creating comments in your app. 
// It uses React Query's mutation functionality to send new comments to the backend,
// and also manages the comment input state locally.
// State Management: It keeps track of the current comment text being typed by the user.
// API Interaction: It uses a secure API client to send the comment data to the backend.
// Cache Handling: After a successful comment post, it invalidates the posts cache so your UI will refetch and show the latest comments.
// Error Handling: If the comment post fails, it shows an alert to inform the user.
// Validation: It prevents empty comments from being submitted and alerts the user if they try.
// Loading State: It exposes a loading indicator state that you can use to disable UI or show spinners while the comment is being created.

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";

// Define and export the custom hook for managing comments
export const useComments = () => {
  // Local state to hold the current comment text input by user
  const [commentText, setCommentText] = useState("");

  // Create authenticated API client instance
  const api = useApiClient();

  // Get query client to invalidate queries after mutations
  const queryClient = useQueryClient();

  // Define mutation for creating a comment
  const createCommentMutation = useMutation({
    // Mutation function accepts postId and comment content, calls API to create comment
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const response = await commentApi.createComment(api, postId, content);
      return response.data; // Return response data for further use if needed
    },

    // On successful comment creation:
    onSuccess: () => {
      setCommentText(""); // Clear the comment input
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh posts to show new comment
    },

    // On error while creating comment:
    onError: () => {
      Alert.alert("Error", "Failed to post comment. Try again."); // Show error alert
    },
  });

  // Function to handle creating a comment when user submits
  const createComment = (postId: string) => {
    // If comment text is empty or only spaces, show alert and return early
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!");
      return;
    }

    // Trigger mutation to create comment with trimmed text
    createCommentMutation.mutate({ postId, content: commentText.trim() });
  };

  // Return state, setters, and handlers for usage in components
  return {
    commentText, // Current comment text value
    setCommentText, // Setter to update comment text
    createComment, // Function to submit comment
    isCreatingComment: createCommentMutation.isPending, // Loading state of comment creation
  };
};
