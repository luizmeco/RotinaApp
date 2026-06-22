import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useCreateTaskForm } from "../../services/CreateTaskFormService";
import { Task } from "../../services/TasksService";
import GlassInput from "../GlassInput";
import GlassMapPicker from "../GlassMapPicker";
import GlassPrioritySelector from "../GlassPrioritySelector";
import GlassModal from "../GlassModal";
import PrimaryButton from "../PrimaryButton";

interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
  /** Se fornecido, o modal entra em modo de edição com os dados da tarefa */
  task?: Task | null;
}

export default function CreateTaskModal({
  isVisible,
  onClose,
  onTaskCreated,
  task,
}: CreateTaskModalProps) {
  const {
    formData,
    loading,
    errors,
    isEditing,
    setField,
    setCoordinates,
    handleSubmit,
    populateForm,
    resetForm,
  } = useCreateTaskForm(() => {
    onTaskCreated?.();
    onClose();
  });

  // Quando o modal abre com uma tarefa, popula o formulário
  useEffect(() => {
    if (isVisible && task) {
      populateForm(task);
    }
  }, [isVisible, task, populateForm]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <GlassModal isVisible={isVisible} onClose={handleClose}>
      <Text className="text-on-surface font-bold text-2xl mb-4">
        {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Título */}
        <View className="mb-4">
          <GlassInput
            label="Título da Tarefa *"
            iconName="check-square"
            placeholder="Ex: Fazer compras..."
            value={formData.title}
            onChangeText={(text) => setField("title", text)}
          />
          {errors.title && (
            <Text className="text-error text-xs font-light mt-1 ml-1">
              {errors.title}
            </Text>
          )}
        </View>

        {/* Descrição */}
        <View className="mb-4">
          <GlassInput
            label="Descrição"
            iconName="align-left"
            placeholder="Descrição da tarefa..."
            value={formData.description}
            onChangeText={(text) => setField("description", text)}
          />
        </View>

        {/* Prioridade */}
        <View className="mb-4">
          <GlassPrioritySelector
            label="Prioridade"
            value={formData.priority}
            onChange={(priority) => setField("priority", priority)}
          />
        </View>

        {/* Localização (Mapa) */}
        <View className="mb-6">
          <GlassMapPicker
            label="Localização *"
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={setCoordinates}
            error={errors.location}
          />
        </View>

        {/* Botão de Criar / Salvar */}
        <PrimaryButton
          title={
            loading
              ? isEditing
                ? "Salvando..."
                : "Criando..."
              : isEditing
                ? "Salvar Alterações"
                : "Criar Tarefa"
          }
          iconName={isEditing ? "note" : "plus"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </ScrollView>
    </GlassModal>
  );
}
