import { View, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";


// 

const TRENDING_TOPICS = [
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },
  { topic: "#React-Native", tweets: "1252K" },

];

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          {/* Search Icon on the search bar */}
          <Feather name="search" size={20} color="#73C883" />
          {/* Text input layout */}
          <TextInput
            placeholder="Search"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#73C883"
          />
        </View>
      </View>

      {/* list of topics and screen can be scroll down */}
      {/* vertical scroll indicator right side of the screen removed */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} >
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Trending for you
          </Text>
          {TRENDING_TOPICS.map((item, index) => (
            <TouchableOpacity key={index} className="py-3 border-b border-gray-100">
              <Text className="text-gray-500 text-sm">Trending in Technology</Text>
              <Text className="font-bold text-gray-900 text-lg">{item.topic}</Text>
              <Text className="text-gray-500 text-sm">{item.tweets} Tweets</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
