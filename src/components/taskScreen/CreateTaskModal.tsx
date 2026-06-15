import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GlassInput from "../GlassInput";
import PrimaryButton from "../PrimaryButton";
import GlassInputDate from "../GlassInputDate";

interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isVisible,
  onClose,
}: CreateTaskModalProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Animação de Fade para o BlurView do fundo usando a API nativa
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true, // Melhora a performance
    }).start();
  }, [isVisible]);

  const handleCreate = () => {
    console.log("Botão clicado! Dados:", { newTaskTitle });
    setNewTaskTitle(""); // Limpa o estado para o próximo uso
    onClose();
  };

  return (
    <>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: fadeAnim, zIndex: 100, elevation: 100 },
        ]}
        pointerEvents="none"
      >
        <BlurView
          intensity={80} // Aumentado para 80 para um efeito Glassmorphism forte
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Modal de Criação de Tarefa (Bottom Sheet) */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          {/* Pressable para fechar ao clicar fora */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          {/* Container do Bottom Sheet */}
          <View className="bg-glass-modal pb-10 pt-4 px-6 rounded-t-[32px] border border-glass-border shadow-modal">
            {/* Tracinho de arrastar estilo iOS */}
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-outline-variant rounded-full" />
            </View>

            <Text className="text-on-surface font-bold text-2xl mb-6">
              Nova Tarefa
            </Text>

            {/* Formulário Visual */}
            <View className="flex-col md:flex-row gap-4 mb-8">
              <View className="flex-1">
                <GlassInput
                  label="Título da Tarefa"
                  iconName="check-square"
                  placeholder="Ex: Fazer compras..."
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                />
              </View>

              <View className="flex-1">
                <GlassInput
                  label="Descrição"
                  iconName="align-left"
                  placeholder="Descrição da tarefa..."
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                />
              </View>
            </View>

            <PrimaryButton
              title="Criar Tarefa"
              iconName="plus"
              onPress={handleCreate}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
