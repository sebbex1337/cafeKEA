import Saldo from "@/components/Saldo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 justify-center items-center relative">
            <Saldo />
            <Text>Home page</Text>
            <TouchableOpacity className="absolute top-10 right-2">
                <Link href={{ pathname: "/modal" as any }}>
                    <Ionicons name="information-circle-outline" size={30} color="grey" />
                </Link>
            </TouchableOpacity>
        </View>
    );
}
