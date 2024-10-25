import { StyleSheet, Text, View } from "react-native";

export default function Modal() {
    return (
        <View style={styles.container}>
            <Text className="text-xl font-bold pb-5">Åbningstider for Cafè KEA</Text>
            <Text>Mandag - Fredag: 08:00 - 16:00</Text>
            <Text>Lørdag - Søndag: Lukket</Text>
            <View className="pt-10">
                <Text className="text-xl font-bold pb-5">Vil du være frivillig?</Text>
                <Text>Kontakt os på: mail@kea </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
    },
});
