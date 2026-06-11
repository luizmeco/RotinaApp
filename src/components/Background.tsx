import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <StatusBar style="light" />

      {/* Blobs de Fundo (Efeito Liquid Glass) fixos na tela inteira */}
      <View className="blob absolute top-[-15%] left-[-25%] w-[60vw] h-[60vw] bg-primary rounded-full opacity-100" />
      <View className="blob absolute bottom-[25%] right-[-25%] w-[40vw] h-[40vw] bg-accent rounded-full opacity-50" />
      <View className="blob absolute bottom-[5%] left-[5%] w-[30vw] h-[30vw] bg-primary rounded-full opacity-50" />

      <BlurView
        intensity={100} // Equivale a força do blur (de 1 a 100)
        tint="dark" // Cor do blur
        experimentalBlurMethod="dimezisBlurView" // Força a renderização do Blur no Android
        style={StyleSheet.absoluteFill} // Faz o blur preencher todo o View pai
      />
      <BlurView
        intensity={100} // Equivale a força do blur (de 1 a 100)
        tint="dark" // Cor do blur
        experimentalBlurMethod="dimezisBlurView" // Força a renderização do Blur no Android
        style={StyleSheet.absoluteFill} // Faz o blur preencher todo o View pai
      />

      {/* ScrollView garante que a tela role se o celular for pequeno ou o teclado abrir */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
