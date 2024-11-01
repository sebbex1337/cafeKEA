import { storage } from "@/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";

export default function PictureGrid() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        async function fetchImages() {
            const imageRef = ref(storage, "images");
            const imageList = await listAll(imageRef);
            const urls = await Promise.all(imageList.items.map(async (item) => await getDownloadURL(item)));
            setImageUrls(urls);
        }
        fetchImages();
    }, []);

    return (
        <View className="w-full h-full items-center justify-center border-2 border-solid border-yellow-900 bg-amber-300 rounded-md pb-28">
            <Text className="text-2xl font-bold mb-1">Keas Coffee Lovers</Text>
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
