import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type Priority = "high" | "medium" | "low";

interface TaskCardProps {
  title: string;
  location: string;
  priority: Priority;
  isCompleted: boolean;
  onToggle: () => void;
  onPress?: () => void;
}

// Mapeamento dinâmico: agora usamos 'barBg' em vez de borda
const priorityStyles = {
  high: {
    barBg: "bg-red-500",
    badgeBorder: "border-red-500/50",
    badgeBg: "bg-red-500/10",
    shadowColor: "shadow-[0_2px_10px_0] shadow-red-500/20",
    textColor: "text-red-500",
    label: "Alta",
  },
  medium: {
    barBg: "bg-orange-400",
    badgeBorder: "border-orange-400/50",
    badgeBg: "bg-orange-400/10",
    shadowColor: "shadow-[0_2px_10px_0] shadow-orange-400/20",
    textColor: "text-orange-400",
    label: "Média",
  },
  low: {
    barBg: "bg-teal-500",
    badgeBorder: "border-teal-500/50",
    badgeBg: "bg-teal-500/10",
    shadowColor: "shadow-[0_2px_10px_0] shadow-teal-500/20",
    textColor: "text-teal-500",
    label: "Baixa",
  },
};

export function TaskCard({
  title,
  location,
  priority,
  isCompleted,
  onToggle,
  onPress,
}: TaskCardProps) {
  const styles = priorityStyles[priority];

  return (
    // 1. Container principal com "overflow-hidden"
    <TouchableOpacity
      activeOpacity={isCompleted ? 1 : 0.7}
      onPress={isCompleted ? undefined : onPress}
      className={`mb-6 rounded-lg ${isCompleted ? "opacity-50" : "bg-glass-white shadow-shadow"}`}
    >
      <View
        className={`flex-row border rounded-lg overflow-hidden ${isCompleted ? "border-slate-700/50" : "border-glass-border"}`}
      >
        {/* 2. Barra lateral colorida - cinza quando concluída */}
        <View
          className={`w-1.5 ${isCompleted ? "bg-slate-600" : styles.barBg}`}
        />

        {/* 3. Container do conteúdo principal */}
        <View className="flex-1 flex-row items-center justify-between p-4">
          {/* Lado Esquerdo: Checkbox + Textos */}
          <View className="flex-row items-center flex-1 pr-4">
            <TouchableOpacity
              onPress={onToggle}
              className="mr-4"
              activeOpacity={0.7}
            >
              {isCompleted ? (
                // Checkbox marcado (quadrado arredondado)
                <View className="w-5 h-5 rounded items-center justify-center bg-[#0ea5e9]">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                // Checkbox desmarcado (círculo)
                <View className="w-5 h-5 border border-slate-500 rounded-full" />
              )}
            </TouchableOpacity>

            <View className="flex-1">
              <Text
                className={`text-base font-semibold ${isCompleted ? "line-through text-slate-600" : "text-white"}`}
                numberOfLines={1}
              >
                {title}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isCompleted ? "#475569" : "#94a3b8"}
                />
                <Text
                  className={`text-sm ml-1 ${isCompleted ? "text-slate-600" : "text-slate-400"}`}
                  numberOfLines={1}
                >
                  {location}
                </Text>
              </View>
            </View>
          </View>

          {/* Lado Direito: Badge de Prioridade */}
          <View
            className={`px-3 py-1 rounded-full border ${
              isCompleted
                ? "border-slate-600/50 bg-slate-700/20"
                : `${styles.badgeBorder} ${styles.badgeBg} ${styles.shadowColor}`
            }`}
          >
            <Text
              className={`text-xs font-medium ${isCompleted ? "text-slate-600" : styles.textColor}`}
            >
              {isCompleted ? "Concluída" : styles.label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
