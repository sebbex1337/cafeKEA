import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { auth, database } from "@/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { ReceiptItem } from "@/types/types";
import { useFocusEffect } from "expo-router";

export default function Receipt() {
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = auth.currentUser;

  const fetchReceipts = useCallback(async () => {
    if (!user) {
      console.log("You need to be logged in to view receipts");
      return;
    }

    setLoading(true);
    try {
      const receiptsCollection = collection(database, "users", user.uid, "receipts");
      const querySnapshot = await getDocs(receiptsCollection);
      const items: ReceiptItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const bought = data.bought instanceof Timestamp ? data.bought.toDate() : new Date();
        items.push({
          id: doc.id,
          bought,
          coffee: data.coffee,
        } as ReceiptItem);
      });
      setReceipts(items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function getReceipts() {
      try {
        if (!user) return;
        const querySnapshot = await getDocs(collection(database, "users", user.uid, "receipts"));
        const items: ReceiptItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ReceiptItem);
        });
        console.log(items);
        setReceipts(items);
      } catch (error) {
        console.log(error);
      }
    }
    getReceipts();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchReceipts();
    }, [fetchReceipts])
  );

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">You need to be logged in to view receipts.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start items-center pt-2 bg-background">
      <Text className="text-3xl font-bold mb-4">Receipts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#808080" />
      ) : receipts.length === 0 ? (
        <Text className="text-lg">No receipts found.</Text>
      ) : (
        <FlatList
          className="w-full px-4"
          onRefresh={fetchReceipts}
          refreshing={loading}
          data={receipts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="py-3 px-4 m-2 rounded-lg bg-gray-100 shadow">
              {/* Row for Coffee Name and Price */}
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xl font-semibold">{item.coffee.name}</Text>
                <Text className="text-red-500 font-semibold">{item.coffee.price.toFixed(2)} DKK</Text>
              </View>
              {/* Purchase Date */}
              <Text className="text-gray-600">Purchased on: {item.bought.toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
