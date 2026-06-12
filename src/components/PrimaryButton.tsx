import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: React.ComponentProps<typeof SimpleLineIcons>["name"];
  colorClass?: string;
  textColorClass?: string;
}

export default function PrimaryButton({
  title,
  iconName,
  colorClass = "bg-primary-container",
  textColorClass = "text-on-primary",
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`${colorClass} border border-glass-border shadow-shadow h-14 rounded-xl flex-row items-center justify-center gap-2`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`${textColorClass} text-base font-bold`}>{title}</Text>
      {props.disabled ? (
        <AntDesign
          name="loading-3-quarters"
          size={21}
          className={`${textColorClass} animate-spin`}
        />
      ) : (
        <SimpleLineIcons
          name={iconName ?? "arrow-right"}
          size={20}
          className={textColorClass}
        />
      )}
    </TouchableOpacity>
  );
}
