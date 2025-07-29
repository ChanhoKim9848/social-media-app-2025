// This file sets up the API client for making authenticated HTTP requests
// using Axios and Clerk authentication in an Expo (React Native) app.

import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = "https://social-media-app-2025-seven.vercel.app/api";
/**
 * Creates an Axios instance that automatically attaches the
 * Clerk authentication token to every request's Authorization header.
 * 
 * @param getToken - A function provided by Clerk to get the current user's JWT token
 */
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  // Add a request interceptor to inject the Bearer token
  api.interceptors.request.use(async (config) => {
    const token = await getToken(); // Fetch the token from Clerk
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

/**
 * React hook to get the pre-configured Axios instance with auth headers
 */
export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

/**
 * API methods related to users (authentication, profile, etc.)
 */
export const userApi = {
  // Sync Clerk user with backend database
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),

  // Get current logged-in user's data
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),

  // Update profile info
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
};

/**
 * API methods related to posts
 */
export const postApi = {
  // Create a new post
  createPost: (
    api: AxiosInstance,
    data: { content: string; image?: string }
  ) => api.post("/posts", data),

  // Get all posts
  getPosts: (api: AxiosInstance) => api.get("/posts"),

  // Get posts made by a specific user
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}`),

  // Like a post
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/like`),

  // Delete a post
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/posts/${postId}`),
};

/**
 * API methods related to comments
 */
export const commentApi = {
  // Create a comment on a specific post
  createComment: (
    api: AxiosInstance,
    postId: string,
    content: string
  ) => api.post(`/comments/post/${postId}`, { content }),
};
