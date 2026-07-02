import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Background from "../components/Background";
import LoadingScreen from "../components/LoadingScreen";
import PrimaryButton from "../components/PrimaryButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { useProfile } from "../services/ProfileService";
import { Feather } from "@expo/vector-icons";

// Componente separado para evitar o bug do NativeWind/css-interop com className dinâmico dentro de .map()
function PresetButton({
  value,
  isSelected,
  onPress,
}: {
  value: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  if (isSelected) {
    return (
      <TouchableOpacity
        key={`selected-${value}`}
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-1 py-2 rounded-lg items-center border bg-primary border-primary shadow-neon"
      >
        <Text className="font-bold text-xs text-white">
          {value >= 1000 ? `${value / 1000}km` : `${value}m`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      key={`unselected-${value}`}
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 py-2 rounded-lg items-center border bg-glass-white border-glass-border"
    >
      <Text className="font-semibold text-xs text-on-surface-variant">
        {value >= 1000 ? `${value / 1000}km` : `${value}m`}
      </Text>
    </TouchableOpacity>
  );
}

export default function Profile() {
  const colors = useThemeColors();
  const {
    loading,
    name,
    email,
    handleLogout,
    radius,
    updateRadius,
    sendTestNotification,
  } = useProfile();

  const presets = [100, 300, 500, 1000, 2000];

  const handleIncrease = () => {
    const step = radius < 500 ? 50 : 100;
    const nextVal = Math.min(5000, radius + step);
    updateRadius(nextVal);
  };

  const handleDecrease = () => {
    const step = radius <= 500 ? 50 : 100;
    const nextVal = Math.max(50, radius - step);
    updateRadius(nextVal);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Background>
      {/* Avatar e Informações do Usuário */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full bg-surface-variant items-center justify-center border-2 border-primary-light mb-4">
          <SimpleLineIcons
            name="user"
            size={40}
            color={colors["primary-light"]}
          />
        </View>
        <Text className="text-primary-light font-semibold text-2xl">
          {name}
        </Text>
        <Text className="text-outline font-regular text-sm mt-1">{email}</Text>
      </View>

      {/* Bloco de Configurações - Glassmorphic Card */}
      <View className="bg-surface/85 border border-glass-border rounded-2xl p-5 mb-8 w-full shadow-shadow">
        <View className="flex-row items-center mb-4 gap-2">
          <Feather name="bell" size={20} color={colors["primary-light"]} />
          <Text className="text-on-surface font-bold text-lg">
            Raio de Alerta de Tarefas
          </Text>
        </View>

        <Text className="text-on-surface-variant font-light text-sm mb-6 leading-relaxed">
          Defina a distância mínima para receber uma notificação ao se aproximar
          de um local associado a uma tarefa pendente.
        </Text>

        {/* Display do Raio Atual e Botões de Controle */}
        <View className="flex-row items-center justify-between bg-glass-white border border-glass-border rounded-xl p-4 mb-6">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDecrease}
            className="w-10 h-10 rounded-lg bg-surface-variant/80 border border-glass-border items-center justify-center"
          >
            <Feather name="minus" size={18} color="#50E6FF" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-white font-bold text-2xl">
              {radius >= 1000
                ? `${(radius / 1000).toFixed(1)} km`
                : `${radius} m`}
            </Text>
            <Text className="text-outline text-xs mt-0.5">
              Raio de proximidade
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleIncrease}
            className="w-10 h-10 rounded-lg bg-surface-variant/80 border border-glass-border items-center justify-center"
          >
            <Feather name="plus" size={18} color="#50E6FF" />
          </TouchableOpacity>
        </View>

        {/* Presets de Seleção Rápida */}
        <Text className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider mb-3">
          Ajuste Rápido
        </Text>
        <View className="flex-row justify-between gap-1.5">
          {presets.map((preset) => (
            <PresetButton
              key={preset}
              value={preset}
              isSelected={radius === preset}
              onPress={() => updateRadius(preset)}
            />
          ))}
        </View>
      </View>

      {/* Botão de Teste de Notificação */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={sendTestNotification}
        className="bg-primary/30 border border-primary rounded-xl py-3 items-center mb-4 w-full"
      >
        <Text className="text-primary-light font-semibold text-sm">
          🔔 Testar Notificação
        </Text>
      </TouchableOpacity>

      {/* Botão de Logout */}
      <PrimaryButton
        title={"Logout"}
        iconName="logout"
        colorClass="bg-error/50"
        textColorClass="text-on-primary"
        onPress={handleLogout}
      />
    </Background>
  );
}
