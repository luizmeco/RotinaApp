import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Background from "../components/Background";
import LoadingScreen from "../components/LoadingScreen";
import { Priority, TaskCard } from "../components/TaskItem";
import { FilterOption, useTasks } from "../services/useTasks";

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
    selectedFilter,
    setSelectedFilter,
    handleToggleTask,
  } = useTasks();

  if (loading) {
    return <LoadingScreen />;
  }

  // Opções de filtro e suas estilizações correspondentes ao TaskItem
  const filters: Array<FilterOption> = ["all", "alta", "media", "baixa"];
  const filterStyles = {
    all: {
      label: "Todas",
      activeBg: "bg-primary-light/10",
      activeBorder: "border-primary-light/50",
      activeText: "text-primary-light",
    },
    alta: {
      label: "Alta",
      activeBg: "bg-red-500/10",
      activeBorder: "border-red-500/50",
      activeText: "text-red-500",
    },
    media: {
      label: "Média",
      activeBg: "bg-orange-400/10",
      activeBorder: "border-orange-400/50",
      activeText: "text-orange-400",
    },
    baixa: {
      label: "Baixa",
      activeBg: "bg-teal-500/10",
      activeBorder: "border-teal-500/50",
      activeText: "text-teal-500",
    },
  };

  return (
    <Background noScroll>
      <View className="flex-1 pt-12">
        <Text className="text-primary-light font-semibold text-3xl mb-4 px-6">
          Minhas Tarefas
        </Text>

        {/* Barra de Filtros de Prioridade */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {filters.map((f) => {
              const isActive = selectedFilter === f;
              const config = filterStyles[f];
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setSelectedFilter(f)}
                  activeOpacity={0.7}
                  className={`mr-3 px-4 py-2 rounded-full border ${
                    isActive
                      ? `${config.activeBg} ${config.activeBorder}`
                      : "bg-glass-white border-glass-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? config.activeText : "text-outline"
                    }`}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
              />
            )}
          />
        )}
      </View>
    </Background>
  );
}
