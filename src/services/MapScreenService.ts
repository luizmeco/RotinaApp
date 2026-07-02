import { useState, useEffect, useRef, useCallback } from "react";
import { Linking } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { useTasks } from "./TasksService";
import { useProximity } from "./ProximityService";

export function useMapScreen() {
  const mapRef = useRef<MapView>(null);
  const { filteredTasks, fetchTasks } = useTasks();
  const { radius } = useProximity();

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

  // Busca a localização do usuário na montagem
  useEffect(() => {
    getUserLocation();
  }, []);

  // Busca as tarefas ativas toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  const getUserLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Se a permissão já foi negada anteriormente, abrimos as configurações do sistema
      const current = await Location.getForegroundPermissionsAsync();
      if (current.status === Location.PermissionStatus.DENIED) {
        setPermissionStatus(Location.PermissionStatus.DENIED);
        setErrorMsg(
          "Permissão de localização negada. Por favor, ative nas configurações.",
        );
        await Linking.openSettings();
        setLoading(false);
        return;
      }

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

  // Filtra apenas tarefas pendentes que possuem coordenadas válidas no banco de dados
  const tasksWithLocation = filteredTasks.filter(
    (t) =>
      t.status !== "concluida" &&
      t.latitude !== undefined &&
      t.latitude !== null &&
      t.longitude !== undefined &&
      t.longitude !== null,
  );

  return {
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
  };
}
