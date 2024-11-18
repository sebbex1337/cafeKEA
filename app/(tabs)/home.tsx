import PictureGrid from "@/components/PictureGrid";
import Saldo from "@/components/Saldo";
import { auth, database } from "@/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Home() {
    const [saldo, setSaldo] = useState(0);
    const user = auth.currentUser;
    const router = useRouter();

    const getUserSaldo = useCallback(async () => {
        try {
            if (user) {
                const docRef = doc(database, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSaldo(docSnap.data().saldo);
                } else {
                    console.log("No such document!");
                }
            }
        } catch (error) {
            console.log("Error getting saldo", error);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            getUserSaldo();
        }, [getUserSaldo])
    );

    return (
        <View className="pt-24 justify-center items-center bg-background">
            <Text className="text-3xl">Velkommen til KEA Café</Text>
            <Saldo userSaldo={saldo} />
            <TouchableOpacity className="absolute top-2 right-2">
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
