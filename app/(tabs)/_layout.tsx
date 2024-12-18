import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        tabBarActiveTintColor: "#7A5C3D",
        tabBarLabelStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "menu-sharp" : "menu-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="receipt"
        options={{
          title: "receipt",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "receipt-sharp" : "receipt-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle-sharp" : "person-circle-outline"} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
