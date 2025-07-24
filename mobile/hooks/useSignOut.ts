import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";

// Sign out custom hook
export const useSignOut = () => {
  // sign out
  const { signOut } = useClerk();

  //   sign out function
  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      // cancel and do nothing
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        // sign in after press logout button
        onPress: () => signOut(),
      },
    ]);
  };

  return { handleSignOut };
};
