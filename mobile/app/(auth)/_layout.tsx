import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  // checks if user is signed in
  const { isSignedIn } = useAuth();

  //   if signed in, redirect to home page
  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack />;
}
