import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 50,
          right: 50,
          height: 64,
          borderRadius: 24,
          backgroundColor: "rgba(255, 255, 255, 0.08)", // glass-white
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)", // glass-border
          borderTopWidth: 1, // RN insere uma borda no topo por padrão
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          elevation: 0, // Remove a sombra padrão do Android
        },
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 24,
              overflow: "hidden",
            }}
          />
        ),
        tabBarActiveTintColor: "#a3c9ff", // primary-light
        tabBarInactiveTintColor: "#8a919e", // outline
        tabBarItemStyle: { paddingBottom: 2, paddingTop: 2 },
        tabBarLabelStyle: {
          fontFamily: "HankenGrotesk_600SemiBold",
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="map" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="user" size={20} color={color} />
          ),
        }}
      />

      {/* Futuramente colocaremos a tela do Mapa aqui */}
    </Tabs>
  );
}
