import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Index() {
    const router = useRouter();
    return (
        <View>
            <Text>Index page</Text>
            <Pressable onPress={() => router.push(`/(tabs)/home`)}>
                <Text>Go to home tabs</Text>
            </Pressable>
        </View>
    );
}
