import { storage } from "@/firebase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";

export default function PictureGrid() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const imageRef = ref(storage, "images");
      const imageList = await listAll(imageRef);

      // Fetch metadata for each image
      const itemsWithMetaData = await Promise.all(
        imageList.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          return {
            itemRef,
            timeCreated: metadata.timeCreated, // ISO string
          };
        })
      );

      // Sort items by timeCreated in descending order (latest first)
      const sortedItems = itemsWithMetaData.sort((a, b) => {
        return new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime();
      });

      // Get the latest 6 items
      const latest6Items = sortedItems.slice(0, 9);

      const urls = await Promise.all(latest6Items.map(async (item) => await getDownloadURL(item.itemRef)));
      setImageUrls(urls);
    } catch (error) {
      console.log("Error fetching images", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [fetchImages])
  );

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (imageUrls.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-xl text-gray-700">No images found</Text>
      </View>
    );
  }

  return (
    <View className="w-full items-center justify-center pb-2 pt-4 bg-[#5E4F46]">
      <Text className="text-2xl font-bold text-white mb-1">Ten Pillars Coffee Lovers</Text>
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      )}
      <FlatList
        className="w-full"
        data={imageUrls}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(url) => (
          <View className="flex-1 items-center justify-center m-1">
            <Image source={{ uri: url.item }} className="w-[120px] h-[120px]" />
          </View>
        )}
      />
    </View>
  );
}
