// This hook encapsulates the logic for retrieving the currently authenticated user's info.
// It uses React Query for data fetching and caching.
// select is used to pick just the user field from the full response, which simplifies consumption.

import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

// Custom hook to fetch the currently authenticated user's data
export const useCurrentUser = () => {
  // Get the configured API client (likely with auth headers)
  const api = useApiClient();

  // Use React Query's useQuery to fetch the current user
  const {
    data: currentUser,  // The fetched user data (or undefined while loading)
    isLoading,          // Boolean flag indicating loading state
    error,              // Error object if the request failed
    refetch,            // Function to manually re-trigger the fetch
  } = useQuery({
    queryKey: ["authUser"],                 // Unique key for caching and identifying the query
    queryFn: () => userApi.getCurrentUser(api), // Function that fetches the current user from backend
    select: (response) => response.data.user,   // Extract only the user object from the response
  });

  // Return the fetched data and relevant query state
  return { currentUser, isLoading, error, refetch };
};


