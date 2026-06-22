import { Feather, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
} from "react-native-maps";

interface GlassMapPickerProps {
  label: string;
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (latitude: number, longitude: number) => void;
  error?: string;
}

export default function GlassMapPicker({
  label,
  latitude,
  longitude,
  onLocationSelect,
  error,
}: GlassMapPickerProps) {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Região padrão (São Paulo) caso a localização não esteja disponível
  const defaultRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setUserLocation(coords);

      // Se ainda não tem pin colocado, centraliza na localização do usuário
      if (latitude === null && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          },
          800,
        );
      }
    } catch {
      // Silencia o erro — o mapa usará a região padrão
    } finally {
      setLoadingLocation(false);
    }
  };

  // Handler para toque no mapa — coloca o pin
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude: lat, longitude: lng } = event.nativeEvent.coordinate;
    onLocationSelect(lat, lng);
  };

  // Coloca o pin na localização atual do usuário
  const handleUseMyLocation = () => {
    if (userLocation) {
      onLocationSelect(userLocation.latitude, userLocation.longitude);
      mapRef.current?.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        600,
      );
    }
  };

  const hasPin = latitude !== null && longitude !== null;

  const initialRegion = hasPin
    ? {
        latitude,
        longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }
    : userLocation
      ? {
          ...userLocation,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }
      : defaultRegion;

  return (
    <View>
      <Text className="text-on-surface font-light text-sm mb-2 ml-1">
        {label}
      </Text>

      {/* Container do Mapa com estilo Glass */}
      <View className="rounded-xl overflow-hidden border border-glass-border shadow-shadow">
        {loadingLocation ? (
          <View
            className="items-center justify-center bg-glass-white"
            style={{ height: 200 }}
          >
            <ActivityIndicator size="small" color="#50E6FF" />
            <Text className="text-outline text-xs mt-2">
              Obtendo localização...
            </Text>
          </View>
        ) : (
          <View style={{ height: 200 }}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              provider={PROVIDER_DEFAULT}
              userInterfaceStyle="dark"
              initialRegion={initialRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onPress={handleMapPress}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              {hasPin && (
                <Marker
                  coordinate={{ latitude: latitude!, longitude: longitude! }}
                  draggable
                  onDragEnd={(e) => {
                    const { latitude: lat, longitude: lng } =
                      e.nativeEvent.coordinate;
                    onLocationSelect(lat, lng);
                  }}
                />
              )}
            </MapView>

            {/* Botão "Usar minha localização" flutuante */}
            {userLocation && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleUseMyLocation}
                className="absolute bottom-2 right-2 flex-row items-center bg-surface/90 px-3 py-2 rounded-lg border border-glass-border"
              >
                <Ionicons name="locate" size={14} color="#50E6FF" />
                <Text className="text-accent text-xs font-semibold ml-1.5">
                  Minha localização
                </Text>
              </TouchableOpacity>
            )}

            {/* Instrução sobreposta ao mapa */}
            {!hasPin && (
              <View className="absolute top-2 left-2 right-2 items-center">
                <View className="bg-surface/85 px-3 py-1.5 rounded-lg border border-glass-border">
                  <Text className="text-on-surface-variant text-xs font-light text-center">
                    Toque no mapa para colocar o pin
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Coordenadas selecionadas */}
      {hasPin && (
        <View className="flex-row items-center mt-2 ml-1">
          <Feather name="map-pin" size={12} color="#14b8a6" />
          <Text className="text-on-surface-variant text-xs font-light ml-1.5">
            {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
          </Text>
        </View>
      )}

      {/* Mensagem de erro */}
      {error && (
        <Text className="text-error text-xs font-light mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
