import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useMapScreen } from "../services/MapScreenService";

export default function MapScreen() {
  const {
    mapRef,
    location,
    errorMsg,
    loading,
    permissionStatus,
    defaultRegion,
    radius,
    getUserLocation,
    centerOnUser,
    getMarkerColor,
    tasksWithLocation,
    fetchTasks,
  } = useMapScreen();

  // Renderizar estado de carregamento inicial
  if (loading && !location) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <View className="bg-surface/90 p-8 rounded-2xl border border-glass-border shadow-neon items-center max-w-[80%]">
          <ActivityIndicator size="large" color="#50E6FF" />
          <Text className="text-on-surface font-semibold text-lg mt-4 text-center">
            Acessando Localização
          </Text>
          <Text className="text-on-surface-variant font-light text-sm mt-2 text-center">
            Solicitando permissão e obtendo coordenadas GPS atuais...
          </Text>
        </View>
      </View>
    );
  }

  // Renderizar estado de erro se permissão negada
  if (permissionStatus === Location.PermissionStatus.DENIED) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <View className="bg-surface/90 p-6 rounded-2xl border border-glass-border shadow-shadow items-center w-full">
          <View className="bg-red-500/10 p-4 rounded-full mb-4">
            <Ionicons name="location-outline" size={48} color="#ff7869" />
          </View>
          <Text className="text-on-surface font-bold text-xl text-center mb-2">
            Permissão Necessária
          </Text>
          <Text className="text-on-surface-variant font-light text-center text-sm mb-6 leading-relaxed">
            Precisamos do acesso à sua localização para mostrar as tarefas
            próximas e centrar o mapa no seu local atual.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={getUserLocation}
            className="w-full bg-primary py-3.5 rounded-lg border border-glass-border shadow-neon items-center justify-center flex-row"
          >
            <Text className="text-white font-semibold text-base">
              Conceder Permissão
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        userInterfaceStyle="dark"
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }
            : defaultRegion
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
      >
        {/* Renderiza o círculo de raio de alerta dinâmico ao redor do usuário */}
        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={radius}
            fillColor="rgba(80, 230, 255, 0.12)"
            strokeColor="rgba(80, 230, 255, 0.35)"
            strokeWidth={1.5}
          />
        )}

        {tasksWithLocation.map((task) => (
          <Marker
            key={task.id}
            coordinate={{ latitude: task.latitude, longitude: task.longitude }}
            title={task.title}
            description={task.description || "Sem descrição"}
            pinColor={getMarkerColor(task.priority)}
          />
        ))}
      </MapView>

      {/* Interface de Vidro (Glassmorphism) superior */}
      <View className="absolute top-12 left-4 right-4 bg-surface/85 p-4 rounded-xl border border-glass-border shadow-shadow">
        <Text className="text-on-surface font-bold text-xl">
          Mapa de Tarefas
        </Text>
        <Text className="text-on-surface-variant font-light text-sm mt-1">
          {tasksWithLocation.length > 0
            ? `${tasksWithLocation.length} tarefa${tasksWithLocation.length !== 1 ? "s" : ""} com localização.`
            : "Nenhuma tarefa com localização cadastrada."}
        </Text>
        {errorMsg && (
          <Text className="text-error font-light text-xs mt-1">{errorMsg}</Text>
        )}
      </View>

      {/* Botões de Controle Flutuantes no Canto Inferior Direito */}
      <View className="absolute bottom-24 right-4 flex-col gap-3">
        {/* Botão de Atualizar/Buscar Tarefas */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            fetchTasks();
            getUserLocation();
          }}
          className="w-12 h-12 bg-surface/90 rounded-full border border-glass-border items-center justify-center shadow-shadow"
        >
          <Ionicons name="refresh" size={22} color="#50E6FF" />
        </TouchableOpacity>

        {/* Botão de Centralizar no Usuário */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={centerOnUser}
          className="w-12 h-12 bg-primary/95 rounded-full border border-glass-border items-center justify-center shadow-neon"
        >
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
