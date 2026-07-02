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
  noScroll?: boolean;
}

export default function Background({
  children,
  noScroll = false,
}: BackgroundProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background items-center w-full"
    >
      <StatusBar style="light" />

      {/* Blobs de Fundo (Efeito Liquid Glass) fixos na tela inteira */}
      <View className="blob absolute top-[-3%] left-[-15%] w-[40vw] h-[40vw] bg-primary rounded-full" />
      <View className="blob absolute bottom-[25%] right-[-5%] w-[25vw] h-[25vw] bg-accent rounded-full" />
      <View className="blob absolute bottom-[5%] left-[5%] w-[20vw] h-[20vw] bg-primary rounded-full" />

      <BlurView
        intensity={80} // Equivale a força do blur (de 1 a 100)
        tint="dark" // Cor do blur
        experimentalBlurMethod="dimezisBlurView" // Força a renderização do Blur no Android
        style={StyleSheet.absoluteFill} // Faz o blur preencher todo o View pai
      />
      <BlurView
        intensity={80} // Equivale a força do blur (de 1 a 100)
        tint="dark" // Cor do blur
        experimentalBlurMethod="dimezisBlurView" // Força a renderização do Blur no Android
        style={StyleSheet.absoluteFill} // Faz o blur preencher todo o View pai
      />

      {noScroll ? (
        <View className="flex-1">{children}</View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 16,
          }}
        >
          {children}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
