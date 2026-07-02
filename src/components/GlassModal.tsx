import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface GlassModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GlassModal({
  isVisible,
  onClose,
  children,
}: GlassModalProps) {
  // Animação de Fade para o BlurView do fundo usando a API nativa
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true, // Melhora a performance
    }).start();
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Blur de fundo cobrindo a tela inteira (dentro do Modal) */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
          <BlurView
            intensity={80}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Pressable para fechar ao clicar fora */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Container do Bottom Sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          className="bg-glass-modal pb-10 pt-4 px-6 rounded-t-[32px] border border-glass-border shadow-modal"
        >
          {/* Tracinho de arrastar estilo iOS */}
          <View className="items-center mb-6">
            <View className="w-12 h-1.5 bg-outline-variant rounded-full" />
          </View>

          {/* Conteúdo do Modal */}
          {children}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
