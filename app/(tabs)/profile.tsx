import { View, Text, Pressable, Modal, TextInput, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth, database } from "../../firebase";
import { useFocusEffect, useRouter } from "expo-router";
import Saldo from "@/components/Saldo";
import { useCallback, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [saldo, setSaldo] = useState(0);

  async function sign_out() {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  }

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

  async function handleTankOp() {
    console.log("din nye saldo");
    const enteredAmount = Number(amount);
    if (!isNaN(enteredAmount) && user) {
      const docRef = doc(database, "users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentSaldo = docSnap.data().saldo || 0;
          const newSaldo = currentSaldo + enteredAmount;
          await updateDoc(docRef, {
            saldo: newSaldo,
          });
          setSaldo(newSaldo);
        }
      } catch (error) {
        console.log("Error getting saldo", error);
      }
    } else {
      console.log("invalid input");
    }
  }

  return (
    <View className="h-full bg-background">
      <View className="items-center py-8">
        <Saldo userSaldo={saldo} />
        <Pressable onPress={() => setModalVisible(true)} className="bg-[#ffd33d] py-2 px-4 rounded-xl mt-4">
          <Text>Tank op</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-white p-6 rounded-xl w-80">
              <Text className="text-lg font-bold mb-4 text-center">Enter Amount</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <View className="flex-row justify-between">
                <Pressable
                  className="w-1/2 mr-2"
                  onPress={() => {
                    handleTankOp();
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-center bg-emerald-600 py-2 px-2 rounded-xl">Submit</Text>
                </Pressable>
                <Pressable className="w-1/2 ml-2" onPress={() => setModalVisible(false)}>
                  <Text className="text-center bg-red-600 py-2 px-2 rounded-xl">Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View className="flex items-center justify-center py-8">
        <Text> logged in as: {auth.currentUser?.email} </Text>
        <Pressable onPress={sign_out} className="bg-[#ffd33d] py-2 px-4 rounded-xl mt-4">
          <Text className="text-center">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
