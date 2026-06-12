import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FilterOption } from "../../services/TasksService";

interface TaskFiltersProps {
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
}

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

export default function TaskFilters({
  selectedFilter,
  onSelectFilter,
}: TaskFiltersProps) {
  return (
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
              onPress={() => onSelectFilter(f)}
              activeOpacity={0.7}
              className={`mr-3 px-4 py-2 rounded-full border ${isActive ? `${config.activeBg} ${config.activeBorder}` : "bg-glass-white border-glass-border"}`}
            >
              <Text
                className={`text-sm font-semibold ${isActive ? config.activeText : "text-outline"}`}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
