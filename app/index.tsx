import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput, Alert, ImageBackground, Image } from "react-native";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import React from "react";

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

        await setDoc(doc(database, "users", userCredential.user.uid), {
          saldo: 0,
        });

        console.log("signed up " + userCredential.user.uid);
      } else {
        Alert.alert("Passwords do not match");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 items-center mt-4">
      <Image
        source={require("../assets/images/tenpillarscoffee-nobg.png")}
        style={{ width: 400, height: 400, marginBottom: 20 }}
      />
      {!signingUp && (
        <>
          <Text className="text-4xl font-bold pb-4">Login</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataLogin.email}
            onChangeText={(email) => setFormDataLogin({ ...formDataLogin, email })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataLogin.password}
            onChangeText={(password) => setFormDataLogin({ ...formDataLogin, password })}
          />
          <Pressable onPress={login} className="rounded-xl px-10 py-4 bg-[#5E4F46] mb-4 mt-4">
            <Text className="text-white">Login</Text>
          </Pressable>
          <Pressable onPress={() => setSigningUp(!signingUp)} className="rounded-xl px-8 py-4 bg-[#5E4F46] mb-4">
            <Text className="text-white">Sign up</Text>
          </Pressable>
        </>
      )}
      {signingUp && (
        <>
          <Text className="text-4xl font-bold pb-4">Register</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.email}
            onChangeText={(email) => setFormDataSignUp({ ...formDataSignUp, email })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.password}
            onChangeText={(password) => setFormDataSignUp({ ...formDataSignUp, password })}
          />
          <TextInput
            placeholder="Enter password again"
            placeholderTextColor="#666"
            secureTextEntry
            className="w-[300] p-2 border rounded-xl mb-2"
            value={formDataSignUp.password2}
            onChangeText={(password2) => setFormDataSignUp({ ...formDataSignUp, password2 })}
          />
          <Pressable onPress={signup} className="rounded-xl px-10 py-4 bg-[#5E4F46] mb-4 mt-4">
            <Text className="text-white">Create account</Text>
          </Pressable>
          <Pressable onPress={() => setSigningUp(!signingUp)} className="rounded-xl px-14 py-4 bg-[#5E4F46] mb-4">
            <Text className="text-white">Go to login</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
