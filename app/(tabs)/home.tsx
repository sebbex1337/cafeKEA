import PictureGrid from "@/components/PictureGrid";
import Saldo from "@/components/Saldo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Home() {
    return (
        <View className="pt-48 justify-center items-center">
            <Saldo />
            <Text>Home page</Text>
            <TouchableOpacity className="absolute top-10 right-2">
                <Link href={{ pathname: "/modal" as any }}>
                    <Ionicons name="information-circle-outline" size={30} color="grey" />
                </Link>
            </TouchableOpacity>
            <View className="w-full mt-36 mx-2">
                <PictureGrid />
            </View>
        </View>
    );
}
