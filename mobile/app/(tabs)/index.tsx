import PostComposer from "@/components/PostComposer";
import SignOutButton from "@/components/SignOutButton";
import { useUserSync } from "@/hooks/useUserSync";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  
  useUserSync();
  return (
    // put screen into safe area on the screen
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        {/* logo style */}
        <Ionicons
          name="logo-twitter"
          size={24}
          color="#73C883"
          style={{
            // logo mirror-reflection
            transform: [{ scaleX: -1 }],
          }}
        />
        {/* <Text className="text-xl font-bold text-gray-900">Home</Text> */}
        <SignOutButton />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
