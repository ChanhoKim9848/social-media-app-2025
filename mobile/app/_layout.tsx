import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
// token cache generate
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      {/* entire application wrapped with tanstack react query  */}
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
