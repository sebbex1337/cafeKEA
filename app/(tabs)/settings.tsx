import { View, Text, Pressable, Modal, TextInput, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "expo-router";
import Saldo from "@/components/Saldo";
import { useState } from "react";

export default function Settings() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState("");

    async function sign_out() {
        try {
            await signOut(auth);
            router.replace("/");
        } catch (error) {
            console.log(error);
        }
    }

    function handleTankOp() {
        console.log("din nye saldo");
    }

    return (
        <View className="h-full bg-yellow-200">
            <View className="bg-red-300 items-center py-8">
                <Saldo />
                <Pressable onPress={() => setModalVisible(true)} className="bg-[#ffd33d] py-2 px-4 rounded-xl mt-4">
                    <Text>Tank op</Text>
                </Pressable>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View className="flex-1 justify-center items-center">
                        <View className="bg-white p-6 rounded-xl w-80">
                            <Text className="text-lg font-bold mb-4">Enter Amount</Text>
                            <TextInput className="border border-gray-300 p-2 rounded mb-4" placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
                            <Button
                                title="Submit"
                                onPress={() => {
                                    handleTankOp();
                                    setModalVisible(false);
                                }}
                            />
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
            <View className="py-8 bg-blue-200">
                <Text> logged in as: {auth.currentUser?.email} </Text>
                <Text> Change password: </Text>
                <Pressable onPress={sign_out} className="bg-[#ffd33d] py-2 px-4 rounded-xl mt-4">
                    <Text className="text-center">Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}
