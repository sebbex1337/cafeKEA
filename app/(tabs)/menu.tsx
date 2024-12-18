import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { auth, database } from "@/firebase";
import { MenuItem } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MenuModal from "@/components/MenuModal";

export default function Menu() {
  const user = auth.currentUser;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load all menu items from the database
  useEffect(() => {
    async function getMenuItems() {
      try {
        const querySnapshot = await getDocs(collection(database, "menu"));
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setMenuItems(items);
      } catch (error) {
        console.log(error);
      }
    }
    getMenuItems();
  }, []);

  const fetchMenuItems = useCallback(async () => {
    if (!user) {
      console.log("You need to be logged in to view Menu");
      return;
    }

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(database, "menu"));
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setMenuItems(items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleItemPress(item: MenuItem) {
    setSelectedItem(item);
    setShowModal(true);
  }

  const handlePurchase = useCallback(async () => {
    if (!selectedItem) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You need to be logged in to purchase");
      return;
    }

    const userDocRef = doc(database, "users", user.uid);
    const receiptsRef = collection(database, "users", user.uid, "receipts");

    try {
      await runTransaction(database, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw "User document does not exist!";
        }

        const currentSaldo = userDoc.data().saldo;

        if (currentSaldo >= selectedItem.price) {
          transaction.update(userDocRef, {
            saldo: currentSaldo - selectedItem.price,
          });

          const newReceiptRef = doc(receiptsRef);
          transaction.set(newReceiptRef, {
            bought: serverTimestamp(),
            coffee: {
              id: selectedItem.id,
              name: selectedItem.name,
              price: selectedItem.price,
            },
          });
        } else {
          throw "Insufficient funds";
        }
      });
      Alert.alert("Success", "Item purchased");
      setShowModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.log("Transaction failed:", error);
      if (error === "Insufficient funds") {
        Alert.alert("Error", "Insufficient funds");
      } else {
        Alert.alert("Error", "Failed to purchase item");
      }
    }
  }, [selectedItem]);

  return (
    <View className="flex-1 justify-center items-center pt-2 bg-background">
      <Text className="font-bold text-4xl pb-4">Menu</Text>
      <FlatList
        className="w-full px-4"
        data={menuItems}
        onRefresh={fetchMenuItems}
        refreshing={loading}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={(menu) => (
          <Pressable onPress={() => handleItemPress(menu.item)}>
            <View className="flex-row justify-between items-center py-3 px-4 m-2 rounded-lg bg-[#FAFAFA] shadow">
              <MaterialCommunityIcons name="coffee-to-go" size={48} color="black" />
              <Text className="text-center text-2xl">{menu.item.name}</Text>
              <Text className="text-center text-2xl font-bold">{menu.item.price}kr</Text>
            </View>
          </Pressable>
        )}
      />
      <MenuModal
        visible={showModal}
        item={selectedItem}
        onClose={() => setShowModal(false)}
        onPurchase={handlePurchase}
      />
    </View>
  );
}
