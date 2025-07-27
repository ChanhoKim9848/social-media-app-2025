import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";




export const useUserSync = () => {
// Checks if the user is signed in (isSignedIn from useAuth()).
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  // If signed in and user hasn’t been synced yet (!syncUserMutation.data), it sends a request to the backend to sync the user data.
  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => console.log("User synced successfully:", response.data.user),
    onError: (error) => console.error("User sync failed:", error),
  });

  // auto-sync user when signed in
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]);

  return null;
};
