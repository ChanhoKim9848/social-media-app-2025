import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";


// This code defines the useNotifications hook, 
// which manages fetching and deleting notifications while providing all necessary states
//  and functions to interact with notifications in your components.

// use notification hook
export const useNotifications = () => {
  const api = useApiClient(); // Creating an API client instance
  const queryClient = useQueryClient(); // Accessing the react-query client to manage caching and invalidation

  const {
    data: notificationsData, // Notifications data from the query
    isLoading, // Loading state flag
    error, // Error state flag
    refetch, // Function to manually refetch notifications data
    isRefetching, // Flag for ongoing refetch state
  } = useQuery({
    queryKey: ["notifications"], // Unique key for the query
    queryFn: () => api.get("/notifications"), // API call to fetch notifications
    select: (res) => res.data.notifications, // Transforming the response to only return notifications
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => api.delete(`/notifications/${notificationId}`), // API call to delete a notification by ID
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }), // Invalidating notifications cache after successful deletion
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId); // Triggering the delete mutation
  };

  return {
    notifications: notificationsData || [], // Returning notifications data, defaulting to an empty array
    isLoading, // Returning loading state
    error, // Returning error state
    refetch, // Returning refetch function to manually trigger the query
    isRefetching, // Returning refetching state
    deleteNotification, // Returning the function to delete notifications
    isDeletingNotification: deleteNotificationMutation.isPending, // Returning whether the delete mutation is still pending
  };
};
