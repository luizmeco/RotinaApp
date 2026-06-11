import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

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

  return (
    <View>
      <Text className="text-on-surface font-light text-sm mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-white/5 border rounded-xl px-4 h-14 transition-colors ${
          isFocused ? "border-primary bg-white/10" : "border-white/10"
        }`}
      >
        <Feather
          name={iconName}
          size={20}
          color={isFocused ? "#a3c9ff" : "#8a919e"}
        />
        <TextInput
          className="flex-1 text-on-surface font-light ml-3 text-base"
          placeholderTextColor="#8a919e"
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
              color="#8a919e"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
