import { useSocialAuth } from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          {/* Image section on the authentication page*/}
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>
          {/* Google sign in button */}
          <View className="top-3 flex-col gap-2">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
              // o auth google
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={isLoading}
              // button shadow design
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2, // only applied to android devices
              }}
            >
              {isLoading ? (
                // if loading state, button shows loading sign
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                //  Google sign in button icon
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/google.png")}
                    // icon location and size
                    className="size-10 mr-3"
                    resizeMode="contain"
                  />
                  {/* Google sign in button text */}
                  <Text className="text-black font-medium text-base">
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Apple sign in button icon */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
              // o auth apple
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={isLoading}
              // button shadow design
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2, // only applied to android devices
              }}
            >
              {isLoading ? (
                // if loading state, button shows loading sign
                <ActivityIndicator size="small" color="#000" />
              ) : (
                //  Apple sign in button image
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/apple.png")}
                    // icon location and size
                    className="size-8 mr-3 right-1 bottom-0.5"
                    resizeMode="contain"
                  />

                  {/* Apple sign in button text  */}
                  <Text className="text-black font-medium text-base">
                    Continue with Apple
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our{" "}
            <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

// TO-DO
// TouchableOpacity and Button difference
