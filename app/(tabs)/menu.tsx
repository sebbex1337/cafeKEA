import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { auth, database } from "@/firebase";
import { MenuItem } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MenuModal from "@/components/MenuModal";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

    try {
      const receiptsRef = collection(database, "users", user.uid, "receipts");
      await addDoc(receiptsRef, {
        bought: serverTimestamp(),
        coffee: {
          id: selectedItem.id,
          name: selectedItem.name,
          price: selectedItem.price,
        },
      });
      setShowModal(false);
      setShowConfirmation(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to purchase item");
    }
  }, [selectedItem]);

  return (
    <View className="flex-1 justify-center items-center pt-2">
      <Text>Menu page</Text>
      <FlatList
        className="w-full"
        data={menuItems}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={(menu) => (
          <Pressable onPress={() => handleItemPress(menu.item)}>
            <View className="flex-row justify-between items-center py-2 px-4 m-2 rounded-3xl bg-orange-200">
              <MaterialCommunityIcons name="coffee-to-go" size={48} color="black" />
              <Text className="text-center text-2xl">{menu.item.name}</Text>
              <Text className="text-center text-2xl">{menu.item.price}kr</Text>
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
      <ConfirmationModal visible={showConfirmation} onClose={() => setShowConfirmation(false)} />
    </View>
  );
}
