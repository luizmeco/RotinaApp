import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTasks } from "../services/TasksService";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { filteredTasks, fetchTasks } = useTasks();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);

  // Coordenadas iniciais padrão (Centro de São Paulo) caso a permissão seja negada
  const defaultRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  useEffect(() => {
    getUserLocation();
    fetchTasks();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMsg("Permissão de localização negada");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);

      // Centraliza o mapa na localização atual do usuário
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          },
          1000,
        );
      }
    } catch (error: any) {
      setErrorMsg("Erro ao obter localização: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        800,
      );
    } else {
      getUserLocation();
    }
  };

  // Mapeamento de prioridade para cores dos marcadores
  const getMarkerColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "#ff7869"; // error / red
      case "baixa":
        return "#14b8a6"; // teal / green-blue
      case "media":
      default:
        return "#fb923c"; // orange
    }
  };

  // Gerar pins de teste mockados próximos se não houver tarefas cadastradas no banco
  const getDisplayTasks = () => {
    const databaseTasks = filteredTasks.filter(
      (t) => t.latitude !== undefined && t.longitude !== undefined,
    );
    if (databaseTasks.length > 0) {
      return databaseTasks;
    }

    // Se o usuário estiver com localização ativa, cria mock pins perto dele para testar
    if (location) {
      const { latitude, longitude } = location.coords;
      return [
        {
          id: "mock-1",
          title: "Exemplo: Passar no Mercado",
          description: "Comprar leite, ovos e pão (Alta prioridade)",
          priority: "alta",
          latitude: latitude + 0.0015,
          longitude: longitude + 0.0015,
          status: "pendente",
        },
        {
          id: "mock-2",
          title: "Exemplo: Pagar conta de luz",
          description: "A lotérica fecha às 17h (Média prioridade)",
          priority: "media",
          latitude: latitude - 0.0015,
          longitude: longitude - 0.001,
          status: "pendente",
        },
        {
          id: "mock-3",
          title: "Exemplo: Buscar Encomenda",
          description: "Retirar nos Correios (Baixa prioridade)",
          priority: "baixa",
          latitude: latitude - 0.0005,
          longitude: longitude + 0.002,
          status: "pendente",
        },
      ];
    }

    // Caso contrário, usa pins mockados em São Paulo
    return [
      {
        id: "mock-sp-1",
        title: "Exemplo: Passar no Mercado",
        description: "Comprar leite, ovos e pão (Alta prioridade)",
        priority: "alta",
        latitude: -23.55052 + 0.0015,
        longitude: -46.633308 + 0.0015,
        status: "pendente",
      },
      {
        id: "mock-sp-2",
        title: "Exemplo: Pagar conta de luz",
        description: "A lotérica fecha às 17h (Média prioridade)",
        priority: "media",
        latitude: -23.55052 - 0.0015,
        longitude: -46.633308 - 0.001,
        status: "pendente",
      },
    ];
  };

  const displayTasks = getDisplayTasks();

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
        showsMyLocationButton={false} // Desabilitamos o nativo para usar nosso botão premium customizado
        showsCompass={true}
      >
        {displayTasks.map((task) => (
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
          {location
            ? `${displayTasks.length} tarefas exibidas nesta região.`
            : "Mostrando região padrão (Permissão negada ou carregando)."}
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
