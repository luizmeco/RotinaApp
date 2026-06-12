import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

export default function MapScreen() {

  // Coordenadas iniciais (Centro de São Paulo)
  const initialRegion = {
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.05, // Controla o zoom inicial (quanto menor, mais perto)
    longitudeDelta: 0.05,
  };

  return (
    <View className="flex-1 bg-background">
      
      {/* O MapView precisa de um tamanho definido para aparecer */}
      <MapView 
        style={StyleSheet.absoluteFillObject} // Padrão ouro para o mapa ocupar a tela toda
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        // userInterfaceStyle="dark" // (Opcional) Força o mapa pro modo escuro no iOS
      >
        
        {/* Aqui colocamos o nosso primeiro Pin (Marcador) */}
        <Marker
          coordinate={{ latitude: -23.550520, longitude: -46.633308 }}
          title="Passar no Mercado"
          description="Comprar leite, ovos e pão"
          pinColor="#0078d4" // Usando o primary do seu Azure Liquid Glass
        />

        <Marker
          coordinate={{ latitude: -23.551500, longitude: -46.632300 }}
          title="Pagar conta de luz"
          description="A lotérica fecha as 17h"
          pinColor="#ffb4ab" // Usando a cor de erro/alta prioridade
        />

      </MapView>

      {/* Interface de Vidro (Glassmorphism) flutuando sobre o mapa */}
      <View className="absolute top-12 left-4 right-4 bg-surface/80 p-4 rounded-xl border border-white/10 shadow-lg">
        <Text className="text-on-surface font-['HankenGrotesk_700Bold'] text-xl">
          Mapa de Tarefas
        </Text>
        <Text className="text-on-surface-variant font-['Inter'] text-sm">
          2 tarefas próximas a você.
        </Text>
      </View>

    </View>
  );
}