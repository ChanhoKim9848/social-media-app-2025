// Represents a user in the application
export interface User {
  _id: string;             // Unique identifier for the user (from database)
  username: string;        // User's unique handle (e.g., @john_doe)
  firstName: string;       // User's first name
  lastName: string;        // User's last name
  profilePicture?: string; // Optional URL to the user's profile picture
}

// Represents a comment made on a post
export interface Comment {
  _id: string;        // Unique identifier for the comment
  content: string;    // Text content of the comment
  createdAt: string;  // ISO timestamp when the comment was created
  user: User;         // The user who made the comment
}

// Represents a post made by a user
export interface Post {
  _id: string;          // Unique identifier for the post
  content: string;      // Text content of the post
  image?: string;       // Optional image URL attached to the post
  createdAt: string;    // ISO timestamp when the post was created
  user: User;           // The user who created the post
  likes: string[];      // Array of user IDs who liked the post
  comments: Comment[];  // List of comments associated with the post
}

// Represents a notification sent to a user
export interface Notification {
  _id: string;  // Unique identifier for the notification

  from: {
    username: string;        // Username of the sender (e.g., who liked/commented/followed)
    firstName: string;       // First name of the sender
    lastName: string;        // Last name of the sender
    profilePicture?: string; // Optional profile picture of the sender
  };

  to: string; // User ID of the receiver of the notification

  type: "like" | "comment" | "follow"; // Type of notification event

  post?: {
    _id: string;         // ID of the post involved in the notification (if applicable)
    content: string;     // Content of the post
    image?: string;      // Optional image from the post
  };

  comment?: {
    _id: string;      // ID of the comment involved in the notification (if applicable)
    content: string;  // Content of the comment
  };

  createdAt: string; // ISO timestamp when the notification was created
}
