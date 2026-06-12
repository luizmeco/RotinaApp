import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
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

interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isVisible,
  onClose,
}: CreateTaskModalProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleCreate = () => {
    console.log("Botão clicado! Dados:", { newTaskTitle });
    setNewTaskTitle(""); // Limpa o estado para o próximo uso
    onClose();
  };

  return (
    <>
      <BlurView
        intensity={isVisible ? 30 : 1}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView" // Força o blur a funcionar no Android
        style={StyleSheet.absoluteFill}
        className={`transition delay-150 duration-200 ease-in ${
          isVisible ? "" : "hidden"
        }`}
      />

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
            <View className="mb-8">
              <GlassInput
                label="Título da Tarefa"
                iconName="check-square"
                placeholder="Ex: Fazer compras..."
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
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
