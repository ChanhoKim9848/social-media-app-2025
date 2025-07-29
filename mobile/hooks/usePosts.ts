import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";

/**
 * Custom hook to fetch, like, and delete posts.
 * Optionally filters posts by a specific username.
 */
export const usePosts = (username?: string) => {
  const api = useApiClient();           // Axios instance with auth token
  const queryClient = useQueryClient(); // React Query cache manager

  /**
   * Fetches either all posts or posts by a specific user
   */
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: username ? ["userPosts", username] : ["posts"], // Unique cache key
    queryFn: () =>
      username
        ? postApi.getUserPosts(api, username)  // Fetch posts by user
        : postApi.getPosts(api),               // Fetch all posts
    select: (response) => response.data.posts, // Extract only `posts` from response
  });

  /**
   * Mutation to like a post
   */
  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });

  /**
   * Mutation to delete a post
   */
  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });

  /**
   * Utility to check if the current user has liked a specific post
   * @param postLikes Array of user IDs who liked the post
   * @param currentUser The currently logged-in user
   */
  const checkIsLiked = (postLikes: string[], currentUser: any) => {
    return currentUser && postLikes.includes(currentUser._id);
  };

  return {
    posts: postsData || [],                       // Fallback to empty array if undefined
    isLoading,
    error,
    refetch,                                      // Allow manual refetch
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    checkIsLiked,
  };
};
