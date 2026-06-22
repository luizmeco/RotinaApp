import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Background from "../components/Background";
import LoadingScreen from "../components/LoadingScreen";
import { Priority, TaskCard } from "../components/taskScreen/TaskItem";
import { Task, useTasks } from "../services/TasksService";
import CreateTaskModal from "../components/taskScreen/CreateTaskModal";
import TaskFilters from "../components/taskScreen/TaskFilters";

// Mapeia a prioridade do banco de dados para a prioridade visual do componente
const mapPriority = (dbPriority: string): Priority => {
  switch (dbPriority) {
    case "alta":
      return "high";
    case "baixa":
      return "low";
    case "media":
    default:
      return "medium";
  }
};

export default function Tasks() {
  const {
    tasks,
    loading,
    filteredTasks,
    fetchTasks,
    selectedFilter,
    setSelectedFilter,
    handleToggleTask,
  } = useTasks();

  // Estados para controle visual do Modal de Criação/Edição
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setCreateModalVisible(true);
  };

  const handleCloseModal = () => {
    setCreateModalVisible(false);
    setEditingTask(null);
  };

  // Solicita permissão de localização assim que a tela home carregar
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Background noScroll>
      <View className="flex-1 pt-12 w-[90vw]">
        <Text className="text-primary-light font-semibold text-3xl mb-4 px-6">
          Minhas Tarefas
        </Text>

        {/* Barra de Filtros de Prioridade */}
        <TaskFilters
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {filteredTasks.length === 0 ? (
          <Text className="text-outline text-base px-6">
            {tasks.length === 0
              ? "Nenhuma tarefa encontrada."
              : "Nenhuma tarefa encontrada com esta prioridade."}
          </Text>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 120,
              paddingTop: 10,
            }}
            renderItem={({ item }) => (
              <TaskCard
                title={item.title}
                location={item.description || "Sem descrição"}
                priority={mapPriority(item.priority)}
                isCompleted={item.status === "concluida"}
                onToggle={() => handleToggleTask(item.id, item.status)}
                onPress={() => handleOpenEditModal(item)}
              />
            )}
          />
        )}

        {/* Botão de Adicionar Tarefa (FAB) */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="absolute bottom-[12%] right-[5%] w-14 h-14 bg-primary/90 rounded-full items-center justify-center shadow-neon z-50 border border-glass-border"
          onPress={() => setCreateModalVisible(true)}
        >
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>

        {/* Modal de Criação/Edição de Tarefa (Bottom Sheet) */}
        <CreateTaskModal
          isVisible={isCreateModalVisible}
          onClose={handleCloseModal}
          onTaskCreated={fetchTasks}
          task={editingTask}
        />
      </View>
    </Background>
  );
}
