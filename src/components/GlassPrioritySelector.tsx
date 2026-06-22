import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { TaskPriority } from "../services/CreateTaskFormService";

interface GlassPrioritySelectorProps {
  label: string;
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

interface PriorityOption {
  key: TaskPriority;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bgSelected: string;
  borderSelected: string;
}

const priorities: PriorityOption[] = [
  {
    key: "baixa",
    label: "Baixa",
    icon: "arrow-down",
    color: "#14b8a6",
    bgSelected: "rgba(20, 184, 166, 0.15)",
    borderSelected: "rgba(20, 184, 166, 0.6)",
  },
  {
    key: "media",
    label: "Média",
    icon: "minus",
    color: "#fb923c",
    bgSelected: "rgba(251, 146, 60, 0.15)",
    borderSelected: "rgba(251, 146, 60, 0.6)",
  },
  {
    key: "alta",
    label: "Alta",
    icon: "arrow-up",
    color: "#ff7869",
    bgSelected: "rgba(255, 120, 105, 0.15)",
    borderSelected: "rgba(255, 120, 105, 0.6)",
  },
];

export default function GlassPrioritySelector({
  label,
  value,
  onChange,
}: GlassPrioritySelectorProps) {
  return (
    <View>
      <Text className="text-on-surface font-light text-sm mb-2 ml-1">
        {label}
      </Text>
      <View className="flex-row gap-2">
        {priorities.map((option) => {
          const isSelected = value === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.7}
              onPress={() => onChange(option.key)}
              className="flex-1 flex-row items-center justify-center h-12 rounded-xl border"
              style={{
                backgroundColor: isSelected
                  ? option.bgSelected
                  : "rgba(255, 255, 255, 0.02)",
                borderColor: isSelected
                  ? option.borderSelected
                  : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Feather
                name={option.icon}
                size={16}
                color={isSelected ? option.color : "#8a919e"}
              />
              <Text
                className="ml-1.5 text-sm font-semibold"
                style={{ color: isSelected ? option.color : "#8a919e" }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
