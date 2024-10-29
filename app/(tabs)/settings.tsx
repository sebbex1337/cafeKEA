import { View, Text, Pressable } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  async function sign_out() {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Settings page</Text>
      <Pressable onPress={sign_out} className="bg-blue-600 py-2 px-4 rounded-xl">
        <Text className="text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
