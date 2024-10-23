import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Index page</Text>
      <Pressable onPress={() => router.replace(`/(tabs)/home`)}>
        <Text>Go to home tabs</Text>
      </Pressable>
    </View>
  );
}
