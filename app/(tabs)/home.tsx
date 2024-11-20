import PictureGrid from "@/components/PictureGrid";
import Saldo from "@/components/Saldo";
import { auth, database } from "@/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Button, Pressable } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function Home() {
  const [saldo, setSaldo] = useState(0);
  const user = auth.currentUser;
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

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

  // Function: Defined inside the component
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
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
        <Pressable onPress={toggleCameraFacing}>
          <Ionicons name="camera" size={48} color="grey" />
        </Pressable>
      </View>
      <PictureGrid />
    </View>
  );
}