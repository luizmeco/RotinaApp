import React from "react";
import { FlatList, Text, View } from "react-native";
import Background from "../components/Background";
import LoadingScreen from "../components/LoadingScreen";
import { useTasks } from "../hooks/TasksHook";

export default function Tasks() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Background>
      <View className="flex-1 p-6 pt-12">
        <Text className="text-primary-light font-semibold text-3xl mb-6">
          Minhas Tarefas
        </Text>

        {tasks.length === 0 ? (
          <Text className="text-outline text-base">
            Nenhuma tarefa encontrada.
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-glass-white border border-glass-border p-4 rounded-xl mb-4">
                <Text className="text-white font-bold text-lg">
                  {item.title}
                </Text>
                {item.description && (
                  <Text className="text-outline mt-1">{item.description}</Text>
                )}
                <Text className="text-primary-light text-xs mt-2 uppercase font-semibold">
                  {item.status} • {item.priority}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </Background>
  );
}
