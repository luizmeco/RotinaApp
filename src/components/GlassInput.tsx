import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

interface GlassInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
}

export default function GlassInput({
  label,
  iconName,
  isPassword = false,
  ...props
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const colors = useThemeColors();

  return (
    <View>
      <Text className="text-on-surface font-light text-sm mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center shadow-neon bg-glass-white border rounded-xl px-4 h-14 transition-colors ${
          isFocused ? "border-primary" : "border-glass-border"
        }`}
      >
        <Feather
          name={iconName}
          size={20}
          color={isFocused ? colors["primary-light"] : colors.outline}
        />
        <TextInput
          className="flex-1 text-on-surface font-light ml-3 text-base placeholder:text-outline"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2 -mr-2"
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={colors.outline}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
