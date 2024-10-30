import { View, Text, FlatList } from "react-native";
import { database } from "@/firebase";
import { MenuItem } from "@/types/types";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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

  return (
    <View className="flex-1 justify-center items-center pt-2">
      <Text>Menu page</Text>
      <FlatList
        className="w-full"
        data={menuItems}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={(menu) => (
          <View className="flex-row justify-between items-center py-2 px-4 m-2 rounded-3xl bg-orange-200">
            <MaterialCommunityIcons name="coffee-to-go" size={48} color="black" />
            <Text className="text-center text-2xl">{menu.item.name}</Text>
            <Text className="text-center text-2xl">{menu.item.price}kr</Text>
          </View>
        )}
      />
    </View>
  );
}
