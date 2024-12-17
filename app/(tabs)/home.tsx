import PictureGrid from "@/components/PictureGrid";
import Saldo from "@/components/Saldo";
import { auth, database } from "@/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useFocusEffect } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
    const [saldo, setSaldo] = useState(0);
    const user = auth.currentUser;
    const [image, setImage] = useState<string | null>(null);
    const storage = getStorage();

    // Hook: Defined outside any conditional
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

    // Hook: Defined outside any conditional
    useFocusEffect(
        useCallback(() => {
            getUserSaldo();
        }, [getUserSaldo])
    );

    async function launchCamera() {
        const result = await ImagePicker.requestCameraPermissionsAsync();
        if (!result.granted) {
            console.log("Permission to access camera was denied");
            return;
        }

        const response = await ImagePicker.launchCameraAsync({
            quality: 1,
            base64: false,
        });

        if (!response.canceled && response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            setImage(uri);

            try {
                const responseFetch = await fetch(uri);
                const blob = await responseFetch.blob();

                const fileName = `images/${user?.uid}_${Date.now()}.jpg`;
                const storageRef = ref(storage, fileName);

                await uploadBytes(storageRef, blob);
                console.log("Image uploaded successfully");

                const downloadURL = await getDownloadURL(storageRef);
                console.log("Download URL: ", downloadURL);

                if (user) {
                    const userDocRef = collection(database, "users", user.uid, "images");
                    await addDoc(userDocRef, {
                        profileImage: downloadURL,
                    });
                    console.log(" download URL saved to firestore");
                }
            } catch (error) {
                console.log("Error uploading image", error);
            }
        }
    }

    return (
        <View className="flex-1 justify-between bg-background">
            <View className="items-center">
                <Text className="text-3xl pb-8 pt-2">Velkommen til KEA Café</Text>
                <Saldo userSaldo={saldo} />
                <TouchableOpacity className="absolute top-2 right-2">
                    <Link href={{ pathname: "/modal" as any }}>
                        <Ionicons name="information-circle-outline" size={30} color="grey" />
                    </Link>
                </TouchableOpacity>
                <Pressable onPress={launchCamera}>
                    <Ionicons name="camera" size={48} color="grey" />
                </Pressable>
            </View>
            <PictureGrid />
        </View>
    );
}
