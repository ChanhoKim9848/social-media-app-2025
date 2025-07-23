import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

// social authentication function
// handle user authenticate either google or apple
export const useSocialAuth = () => {
  // loading state initiailize to false
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    // set to true
    setIsLoading(true);

    // create session id and set active,
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
      //   error handle for social auth error
    } catch (err) {
      console.log("Error in social auth", err);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`
      );
      //   set loading state to false
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSocialAuth };
};
