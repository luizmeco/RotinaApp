import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: React.ComponentProps<typeof SimpleLineIcons>["name"];
}

export default function PrimaryButton({
  title,
  iconName,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className="bg-primary-container border border-glass-border h-14 rounded-xl flex-row items-center justify-center gap-2"
      activeOpacity={0.8}
      {...props}
    >
      <Text className="text-on-primary text-base font-bold">{title}</Text>
      {props.disabled ? (
        <AntDesign
          name="loading-3-quarters"
          size={21}
          className="text-on-primary animate-spin"
        />
      ) : (
        <SimpleLineIcons
          name={iconName ?? "arrow-right"}
          size={20}
          className="text-on-primary"
        />
      )}
    </TouchableOpacity>
  );
}
