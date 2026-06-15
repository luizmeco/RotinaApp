import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

interface GlassInputDateProps {
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function GlassInputDate({
  label,
  iconName,
  value,
  onChange
}: GlassInputDateProps) {
  const [showPicker, setShowPicker] = useState(false);
  const colors = useThemeColors();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // No iOS, o picker não fecha sozinho. No Android, o "default" já cuida disso.
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Text className="text-on-surface font-light text-sm mb-2 ml-1">
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
        className="flex-row items-center shadow-shadow bg-glass-white border border-glass-border rounded-xl px-4 h-14 transition-colors"
      >
        <Feather name={iconName} size={20} color={colors.outline} />
        <Text className="flex-1 text-on-surface font-light ml-3 text-base">
          {value ? value.toLocaleDateString("pt-BR") : "Selecione uma data"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
