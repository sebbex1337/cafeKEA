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
        <View className="items-center border-solid border-2 border-red-600 bg-amber-300 rounded-md w-[90%] py-3">
            <Text className=" font-bold text-lg">Saldo:</Text>
            <Text className="text-5xl">{userSaldo} kr.</Text>
        </View>
    );
}
