import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
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
      <Text className="text-on-primary font-light text-base font-bold">
        {title}
      </Text>
      {iconName && <SimpleLineIcons name={iconName} size={20} color="white" />}
    </TouchableOpacity>
  );
}
