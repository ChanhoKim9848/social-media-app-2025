import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSignOut } from "@/hooks/useSignOut";

// Sign out Button and Layout
const SignOutButton = () => {
  // call sign out custom hook
  const { handleSignOut } = useSignOut();

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color={"#E0245E"} />
    </TouchableOpacity>
  );
};

export default SignOutButton;
