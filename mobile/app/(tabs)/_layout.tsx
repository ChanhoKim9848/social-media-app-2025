import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

const TabsLayout = () => {
  // In React Native, "insets" refer to the safe areas of the screen,
  // which are the regions that are not obscured by system UI elements
  // like the status bar, navigation bar, or
  // the home indicator on devices with notches or rounded corners.
  const insets = useSafeAreaInsets();

  // check user authentication
  const { isSignedIn } = useAuth();

  //  redirect to auth page when not authenticated
  if (!isSignedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        // color when tab is active - global
        tabBarActiveTintColor: "#73C883",
        // inactive
        tabBarInactiveTintColor: "#657786",

        // tab bar style
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E1E8ED",
          height: 50 + insets.bottom,
          paddingTop: 8,
        },

        // get rid of header shown
        headerShown: false,

        // tab bar label style
        // tabBarLabelStyle:{
        //   fontSize:25,
        //   fontWeight:"500",
        // }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // hide title underneath
          title: "",
          tabBarIcon: ({ color, size }) => (
            // home icon
            // put size as default since each icon too small
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          // hide title underneath
          title: "",
          tabBarIcon: ({ color, size }) => (
            // search icon
            // put size as default since each icon too small
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          // hide title underneath
          title: "",
          tabBarIcon: ({ color, size }) => (
            // notifications bell icon
            // put size as default since each icon too small
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          // hide title underneath
          title: "",
          tabBarIcon: ({ color, size }) => (
            // mail icon
            // put size as default since each icon too small
            <Feather name="mail" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // hide title underneath
          title: "",
          tabBarIcon: ({ color, size }) => (
            // user (profile) icon
            // put size as default since each icon too small
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
