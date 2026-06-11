import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Background from "./Background";

export default function LoadingScreen() {
  return (
    <Background>
      <View className="items-center justify-center">
        <AntDesign
          name="loading-3-quarters"
          size={48}
          className="text-primary-light animate-spin mb-4"
          color="#a3c9ff"
        />
        <Text className="text-primary-light font-bold text-xl">Carregando...</Text>
      </View>
    </Background>
  );
}
