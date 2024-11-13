import { MenuItem } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebase";
import { useCallback, useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, Alert, TouchableWithoutFeedback } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface MenuModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onPurchase: () => void;
}

const SWIPE_THRESHOLD = 170;
const MAX_TRANSLATE_X = 200;

export default function MenuModal({ visible, item, onClose, onPurchase }: MenuModalProps) {
  if (!item) return null; // Return null if no item is selected so we don't render anything
  // Shared value to keep track of the translation of the swipe gesture
  const translateX = useSharedValue(0);
  // Ref to keep track of if the user has purchased the item
  const hasPurchased = useRef(false);

  // Checks if user is logged in
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "You need to be logged in to purchase");
    return;
  }

  // Makes sure parent component handles the purchase only once
  const purchaseCoffee = useCallback(() => {
    if (hasPurchased.current) return;
    hasPurchased.current = true;
    onPurchase();
  }, [onPurchase]);

  // Handles the PanGestureHandler event and triggers the purchaseCoffee function if the swipe threshold is reached
  const onGestureEvent = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      translateX.value =
        event.nativeEvent.translationX > MAX_TRANSLATE_X ? MAX_TRANSLATE_X : event.nativeEvent.translationX;
      if (event.nativeEvent.translationX > SWIPE_THRESHOLD && !hasPurchased.current) {
        translateX.value = withSpring(MAX_TRANSLATE_X, {}, () => {
          runOnJS(purchaseCoffee)();
        });
      }
    },
    [translateX, purchaseCoffee]
  );

  // Resets the translateX value when the modal is opened
  useEffect(() => {
    if (visible) {
      translateX.value = 0;
      hasPurchased.current = false;
    }
  }, [visible, translateX]);

  // Animated style to move the arrow icon
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="w-[80%] bg-white rounded-2xl p-6 items-center shadow-slate-500">
              <Text className="text-2xl font-bold mb-4">{item?.name}</Text>
              <Text className="text-xl mb-2">{item?.price}kr</Text>
              <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View className="w-full mt-4">
                  <View className="relative h-12 bg-gray-200 rounded-full p-10">
                    <Animated.View style={animatedStyle} className="absolute left-4 top-0 bottom-0 justify-center">
                      <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center">
                        <Ionicons name="arrow-forward" size={24} color="black" />
                      </View>
                    </Animated.View>
                  </View>
                  <Text className="mt-2 text-center text-sm text-gray-600">Swipe right to purchase</Text>
                </Animated.View>
              </PanGestureHandler>
              <Pressable onPress={onClose} className="bg-blue-500 rounded-lg px-4 py-2">
                <Text className="text-white font-semibold">Close</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
