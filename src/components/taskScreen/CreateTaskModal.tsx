import React, { useState } from "react";
import { Text, View } from "react-native";
import GlassInput from "../GlassInput";
import PrimaryButton from "../PrimaryButton";
import GlassInputDate from "../GlassInputDate";
import GlassModal from "../GlassModal";

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
    <GlassModal isVisible={isVisible} onClose={onClose}>
      <Text className="text-on-surface font-bold text-2xl mb-6">
        Nova Tarefa
      </Text>

      {/* Formulário Visual */}
      <View className="flex-col md:flex-row gap-4 mb-8">
        <View className="flex-auto">
          <GlassInput
            label="Título da Tarefa"
            iconName="check-square"
            placeholder="Ex: Fazer compras..."
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
        </View>

        <View className="flex-auto">
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
    </GlassModal>
  );
}
