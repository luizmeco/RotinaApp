import { BlurView } from "expo-blur";
import React from "react";
import { View } from "react-native";

interface GlassCardProps {
  children: React.ReactNode;
}

export default function GlassCard({ children }: GlassCardProps) {
  return (
    <View className="rounded-[24px] overflow-hidden border border-glass-border shadow-lg">
      <BlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="p-8"
      >
        {children}
      </BlurView>
    </View>
  );
}
