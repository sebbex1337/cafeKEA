import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 justify-center items-center">
            <Text>Home page</Text>
            <Link href={{ pathname: "/modal" as any }}>Open modal</Link>
        </View>
    );
}
