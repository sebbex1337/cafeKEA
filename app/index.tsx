import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [formDataLogin, setFormDataLogin] = useState({ email: "", password: "" });
  const [formDataSignUp, setFormDataSignUp] = useState({ email: "", password: "", password2: "" });
  const [signingUp, setSigningUp] = useState(false);

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
      const userCredential = await signInWithEmailAndPassword(auth, formDataLogin.email, formDataLogin.password);
      console.log("logged in " + userCredential.user.uid);
    } catch (error) {
      console.log(error);
    }
  }

  async function signup() {
    try {
      if (formDataSignUp.password === formDataSignUp.password2) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formDataSignUp.email,
          formDataSignUp.password
        );
        console.log("signed up " + userCredential.user.uid);
      } else {
        Alert.alert("Passwords do not match");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      {!signingUp && (
        <>
          <Text className="text-4xl font-bold pb-4">Login to cafeKEA</Text>
          <TextInput
            placeholder="Email"
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataLogin.email}
            onChangeText={(email) => setFormDataLogin({ ...formDataLogin, email })}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataLogin.password}
            onChangeText={(password) => setFormDataLogin({ ...formDataLogin, password })}
          />
          <Pressable onPress={login} className="rounded-xl px-4 py-2 bg-[#ffd33d] mb-4">
            <Text>Login</Text>
          </Pressable>
          <Pressable onPress={() => setSigningUp(!signingUp)} className="rounded-xl px-4 py-2 bg-[#ffd33d] mb-4">
            <Text>Sign up</Text>
          </Pressable>
        </>
      )}
      {signingUp && (
        <>
          <Text className="text-4xl font-bold pb-4">Register to cafeKEA</Text>
          <TextInput
            placeholder="Email"
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.email}
            onChangeText={(email) => setFormDataSignUp({ ...formDataSignUp, email })}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.password}
            onChangeText={(password) => setFormDataSignUp({ ...formDataSignUp, password })}
          />
          <TextInput
            placeholder="Enter password again"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.password2}
            onChangeText={(password2) => setFormDataSignUp({ ...formDataSignUp, password2 })}
          />
          <Pressable onPress={signup} className="rounded-xl px-4 py-2 bg-[#ffd33d] mb-4">
            <Text>Create account</Text>
          </Pressable>
          <Pressable onPress={() => setSigningUp(!signingUp)} className="rounded-xl px-4 py-2 bg-[#ffd33d] mb-4">
            <Text>Go to login</Text>
          </Pressable>
        </>
      )}
      <Pressable onPress={() => router.replace(`/(tabs)/home`)}>
        <Text>Go to home tabs</Text>
      </Pressable>
    </View>
  );
}
