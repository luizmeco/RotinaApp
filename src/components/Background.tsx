import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

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

      {/* ScrollView garante que a tela role se o celular for pequeno ou o teclado abrir */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Blobs de Fundo (Efeito Liquid Glass) */}
        <View className="blob absolute top-[-15%] left-[-25%] w-[60vw] h-[60vw] bg-[#0078d4] rounded-full opacity-25"/>
        <View className="blob absolute bottom-[25%] right-[-25%] w-[40vw] h-[40vw] bg-[#00c2da] rounded-full opacity-10" />
        <View className="blob absolute bottom-[5%] left-[5%] w-[30vw] h-[30vw] bg-[#0078d4] rounded-full opacity-30" />

        <BlurView 
          intensity={100} // Equivale a força do blur (de 1 a 100)
          tint="dark" // Cor do blur
          style={StyleSheet.absoluteFill} // Faz o blur preencher todo o View pai
        />

        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
