import { View, Text } from "react-native";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Saldo() {
    const user = auth.currentUser;
    const [saldo, setSaldo] = useState(0);

    useEffect(() => {
        async function getUserSaldo() {
            try {
                if (user) {
                    const docRef = doc(database, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data) {
                            setSaldo(data.saldo);
                        }
                    }
                }
            } catch (error) {
                console.log("Error getting saldo", error);
            }
        }
        getUserSaldo();
    }, []);

    return (
        <View className="items-center border-solid border-2 border-red-600 bg-amber-300 rounded-md w-[90%] py-3">
            <Text className=" font-bold text-lg">Saldo:</Text>
            <Text className="text-5xl">{saldo} kr.</Text>
        </View>
    );
}
