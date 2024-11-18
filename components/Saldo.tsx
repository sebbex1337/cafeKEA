import { auth, database } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface SaldoProps {
  userSaldo: number;
  showTankOp?: boolean;
}

export default function Saldo({ userSaldo, showTankOp }: SaldoProps) {
  return (
    <View className="items-center px-8 py-4">
      <Text className=" font-bold text-lg pb-2">Din saldo:</Text>
      <Text className="text-5xl">{userSaldo} kr.</Text>
    </View>
  );
}
