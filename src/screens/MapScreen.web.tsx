// src/screens/MapScreen.web.tsx
import React from "react";
import { View, Text } from "react-native";
import Background from "../components/Background";

export default function MapScreen() {
  return (
    <Background>
      <Text className="text-on-surface font-light text-2xl mb-2 text-center">
        Ops! Mapa Indisponível
      </Text>
      <Text className="text-on-surface-variant font-light text-center text-base">
        O mapa interativo usa recursos nativos e só está disponível no
        aplicativo Mobile.{"\n\n"}
        Abra no emulador Android ou iOS para visualizar as tarefas no mapa.
      </Text>
    </Background>
  );
}
