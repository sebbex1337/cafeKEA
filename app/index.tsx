import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import { useEffect, useState } from "react";

const auth = getAuth(app);

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const _auth = getAuth();
    onAuthStateChanged(_auth, (user) => {
      if (user) {
        router.replace(`/(tabs)/home`);
      }
    });
  }, []);

  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in " + userCredential.user.uid);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Login page</Text>
      <TextInput placeholder="Email" className="w-[300] p-2" value={email} onChangeText={(email) => setEmail(email)} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="w-[300] p-2"
        value={password}
        onChangeText={(password) => setPassword(password)}
      />
      <Pressable onPress={login} className="rounded-xl px-4 py-2 bg-blue-600 mb-4">
        <Text className="text-white">Login</Text>
      </Pressable>
      <Pressable onPress={() => router.replace(`/(tabs)/home`)}>
        <Text>Go to home tabs</Text>
      </Pressable>
    </View>
  );
}
