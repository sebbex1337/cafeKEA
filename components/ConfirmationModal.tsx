import { Modal, View, Text, Pressable, TouchableWithoutFeedback } from "react-native";

interface PurchaseConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PurchaseConfirmationModal({ visible, onClose }: PurchaseConfirmationModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="w-72 bg-white rounded-2xl p-6 items-center shadow-lg">
              <Text className="text-2xl font-bold mb-4">Purchase Successful!</Text>
              <Pressable onPress={onClose} className="bg-green-500 rounded-lg px-4 py-2">
                <Text className="text-white font-semibold">OK</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
