import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: keyof typeof Feather.glyphMap;
}

export default function PrimaryButton({
  title,
  iconName,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className="bg-primary-container h-14 rounded-xl flex-row items-center justify-center gap-2"
      activeOpacity={0.8}
      {...props}
    >
      <Text className="text-on-primary-container font-['Inter'] text-base font-bold">
        {title}
      </Text>
      {iconName && <Feather name={iconName} size={20} color="white" />}
    </TouchableOpacity>
  );
}
